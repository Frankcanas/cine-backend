// app/src/services/cart.service.ts
/**
 * Servicio de Carrito con integración SeatLock (HU-010 - P2-16)
 * -------------------------------------------------------------
 * - Al agregar Ticket al carrito valida lock vigente o auto-lockea
 * - Al confirmar Orden crea Tickets y borra SeatLocks atómicamente
 */
import { Op, Transaction } from "sequelize";
import sequelize from "../config/database";
import Cart from "../models/cart.model";
import CartTicket from "../models/cart-ticket.model";
import Order from "../models/order.model";
import Ticket from "../models/ticket.model";
import SeatLock from "../models/seat-lock.model";
import Showtime from "../models/showtime.model";
import Seat from "../models/seat.model";
import { SeatRepository } from "../repositories/seat.repository";

const seatRepository = new SeatRepository();

export class CartService {
  /**
   * Agrega asiento al carrito validando lock vigente.
   * Si no hay lock vigente del usuario, auto-lockea 10 min.
   */
  async addSeatToCart(
    cartId: number,
    showtimeId: number,
    seatId: number,
    userId: number,
    price?: number
  ): Promise<CartTicket> {
    return await sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE },
      async (t) => {
        const cart = await Cart.findByPk(cartId, { transaction: t, lock: t.LOCK.UPDATE });
        if (!cart) {
          const err: any = new Error("Carrito no encontrado");
          err.statusCode = 404;
          throw err;
        }
        if (cart.userId !== userId) {
          const err: any = new Error("El carrito no pertenece al usuario");
          err.statusCode = 403;
          throw err;
        }
        if (cart.status !== "OPEN") {
          const err: any = new Error("El carrito no está abierto");
          err.statusCode = 409;
          throw err;
        }

        // Validar showtime y seat pertenecen a sala
        const showtime = await Showtime.findByPk(showtimeId, { transaction: t });
        if (!showtime) {
          const err: any = new Error("Función no encontrada");
          err.statusCode = 404;
          throw err;
        }
        const seat = await Seat.findOne({
          where: { id: seatId, roomId: showtime.roomId },
          transaction: t,
        });
        if (!seat) {
          const err: any = new Error("Asiento no pertenece a esta función");
          err.statusCode = 404;
          throw err;
        }

        // Verificar si ya está en carrito
        const existing = await CartTicket.findOne({
          where: { cartId, seatId, showtimeId },
          transaction: t,
        });
        if (existing) {
          const err: any = new Error("El asiento ya está en el carrito");
          err.statusCode = 409;
          throw err;
        }

        // Verificar lock vigente del mismo usuario
        const activeLock = await SeatLock.findOne({
          where: {
            showtimeId,
            seatId,
            userId,
            status: "LOCKED",
            expiresAt: { [Op.gt]: new Date() },
          },
          transaction: t,
        });

        if (!activeLock) {
          // Auto-lock 10 min dentro de la misma transacción (sin anidar transaction serializable)
          // Creamos lock directamente; seatRepository.lockSeats usa su propia transacción, por lo que aquí lo hacemos manual
          const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
          // Limpiar expirados y verificar sold/locked antes de crear
          await SeatLock.destroy({
            where: { showtimeId, expiresAt: { [Op.lte]: new Date() } },
            transaction: t,
          });
          const sold = await Ticket.findOne({
            where: { showtimeId, seatId, status: "VALID" },
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          if (sold) {
            const err: any = new Error("Asiento ya vendido");
            err.statusCode = 409;
            throw err;
          }
          const lockedByOther = await SeatLock.findOne({
            where: {
              showtimeId,
              seatId,
              userId: { [Op.ne]: userId },
              status: "LOCKED",
              expiresAt: { [Op.gt]: new Date() },
            },
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          if (lockedByOther) {
            const err: any = new Error("Asiento bloqueado por otro usuario");
            err.statusCode = 409;
            throw err;
          }
          await SeatLock.create(
            { showtimeId, seatId, userId, status: "LOCKED", expiresAt },
            { transaction: t }
          );
        }

        const finalPrice = price ?? Number(showtime.price) ?? 0;
        const cartTicket = await CartTicket.create(
          { cartId, seatId, showtimeId, price: finalPrice },
          { transaction: t }
        );
        return cartTicket;
      }
    );
  }

  /**
   * Checkout: crea Order + Tickets y libera SeatLocks atómicamente
   */
  async checkoutCart(
    cartId: number,
    userId: number,
    buyerName: string,
    paymentMethod: string = "CARD"
  ): Promise<{ order: Order; tickets: Ticket[] }> {
    return await sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE },
      async (t) => {
        const cart = await Cart.findByPk(cartId, {
          include: [{ model: CartTicket }],
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        if (!cart) {
          const err: any = new Error("Carrito no encontrado");
          err.statusCode = 404;
          throw err;
        }
        if (cart.userId !== userId) {
          const err: any = new Error("El carrito no pertenece al usuario");
          err.statusCode = 403;
          throw err;
        }
        if (cart.status !== "OPEN") {
          const err: any = new Error("El carrito no está abierto");
          err.statusCode = 409;
          throw err;
        }
        const cartTickets = (cart as any).cartTickets as CartTicket[];
        if (!cartTickets || cartTickets.length === 0) {
          const err: any = new Error("Carrito vacío");
          err.statusCode = 400;
          throw err;
        }

        // Validar locks vigentes por cada ticket
        for (const ct of cartTickets) {
          const lock = await SeatLock.findOne({
            where: {
              showtimeId: ct.showtimeId,
              seatId: ct.seatId,
              userId,
              status: "LOCKED",
              expiresAt: { [Op.gt]: new Date() },
            },
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          if (!lock) {
            const err: any = new Error(`Asiento ${ct.seatId} sin bloqueo vigente para esta función`);
            err.statusCode = 409;
            throw err;
          }
          const sold = await Ticket.findOne({
            where: { showtimeId: ct.showtimeId, seatId: ct.seatId, status: "VALID" },
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          if (sold) {
            const err: any = new Error(`Asiento ${ct.seatId} ya vendido`);
            err.statusCode = 409;
            throw err;
          }
        }

        const total = cartTickets.reduce((sum, ct) => sum + Number(ct.price ?? 0), 0);

        const order = await Order.create(
          { cartId, userId, total, status: "PAID", paymentMethod },
          { transaction: t }
        );

        const tickets: Ticket[] = [];
        for (const ct of cartTickets) {
          const qrCode = `TICKET-${ct.showtimeId}-${ct.seatId}-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
          const ticket = await Ticket.create(
            {
              orderId: order.id,
              showtimeId: ct.showtimeId!,
              seatId: ct.seatId,
              qrCode,
              status: "VALID",
              buyerName,
            },
            { transaction: t }
          );
          tickets.push(ticket);
          // Liberar lock
          await SeatLock.destroy({
            where: { showtimeId: ct.showtimeId, seatId: ct.seatId, userId },
            transaction: t,
          });
        }

        await cart.update({ status: "CLOSED" }, { transaction: t });

        return { order, tickets };
      }
    );
  }

  async getCartById(cartId: number, userId: number): Promise<Cart | null> {
    const cart = await Cart.findByPk(cartId, {
      include: [{ model: CartTicket, include: [Seat, Showtime] }],
    });
    if (cart && cart.userId !== userId) {
      const err: any = new Error("No autorizado");
      err.statusCode = 403;
      throw err;
    }
    return cart;
  }
}

export const cartService = new CartService();
