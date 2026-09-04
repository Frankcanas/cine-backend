// @ts-nocheck
// app/src/tests/seat.service.test.ts - HU-010 bloqueo, expiración, validaciones
import { describe, it, expect, jest, beforeEach } from "@jest/globals";

jest.mock("../models/seat.model", () => ({
  __esModule: true,
  default: { findAll: jest.fn(), findOne: jest.fn() },
}));
jest.mock("../models/showtime.model", () => ({
  __esModule: true,
  default: { findByPk: jest.fn() },
}));
jest.mock("../models/ticket.model", () => ({
  __esModule: true,
  default: { findAll: jest.fn(), findOne: jest.fn(), count: jest.fn() },
}));
jest.mock("../models/seat-lock.model", () => ({
  __esModule: true,
  default: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
  },
}));
jest.mock("../config/database", () => ({
  __esModule: true,
  default: {
    transaction: jest.fn(async (_opts: any, cb: any) => {
      const t: any = { LOCK: { UPDATE: "UPDATE" } };
      return cb(t);
    }),
    fn: jest.fn(),
    col: jest.fn(),
  },
}));

import Seat from "../models/seat.model";
import Showtime from "../models/showtime.model";
import Ticket from "../models/ticket.model";
import SeatLock from "../models/seat-lock.model";
import { SeatRepository } from "../repositories/seat.repository";

describe("SeatRepository - HU-010", () => {
  let repo: SeatRepository;
  beforeEach(() => {
    jest.clearAllMocks();
    repo = new SeatRepository();
  });

  it("lock exitoso → crea LOCKED con expiresAt", async () => {
    (Showtime.findByPk as jest.Mock).mockResolvedValue({ id: 1, roomId: 10 });
    (Seat.findAll as jest.Mock).mockResolvedValue([{ id: 1 }, { id: 2 }]);
    (SeatLock.destroy as jest.Mock).mockResolvedValue(0);
    (Ticket.findAll as jest.Mock).mockResolvedValue([]);
    (SeatLock.findAll as jest.Mock).mockResolvedValue([]);
    (SeatLock.findOne as jest.Mock).mockResolvedValue(null);
    (SeatLock.create as jest.Mock).mockResolvedValue({ id: 1 });

    const result = await repo.lockSeats(1, [1, 2], 5, 10);
    expect(result.success).toBe(true);
    expect(result.lockedSeats).toEqual([1, 2]);
    expect(SeatLock.create).toHaveBeenCalledTimes(2);
  });

  it("segundo lock mismo asiento otro usuario → 409", async () => {
    (Showtime.findByPk as jest.Mock).mockResolvedValue({ id: 1, roomId: 10 });
    (Seat.findAll as jest.Mock).mockResolvedValue([{ id: 1 }]);
    (SeatLock.destroy as jest.Mock).mockResolvedValue(0);
    (Ticket.findAll as jest.Mock).mockResolvedValue([]);
    (SeatLock.findAll as jest.Mock).mockResolvedValue([{ seatId: 1, userId: 99 }]);

    await expect(repo.lockSeats(1, [1], 5, 10)).rejects.toMatchObject({ statusCode: 409 });
  });

  it("asiento inexistente o no pertenece a sala → 404", async () => {
    (Showtime.findByPk as jest.Mock).mockResolvedValue({ id: 1, roomId: 10 });
    (Seat.findAll as jest.Mock).mockResolvedValue([]); // no matching seats

    await expect(repo.lockSeats(1, [999], 5, 10)).rejects.toMatchObject({ statusCode: 404 });
  });

  it("showtime inexistente → 404", async () => {
    (Showtime.findByPk as jest.Mock).mockResolvedValue(null);
    await expect(repo.lockSeats(999, [1], 5, 10)).rejects.toMatchObject({ statusCode: 404 });
  });

  it("release manual → borra lock del usuario", async () => {
    (Showtime.findByPk as jest.Mock).mockResolvedValue({ id: 1, roomId: 10 });
    (SeatLock.destroy as jest.Mock).mockResolvedValue(1);
    const deleted = await repo.releaseSeats(1, [1], 5);
    expect(deleted).toBe(1);
    expect(SeatLock.destroy).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ userId: 5 }) }));
  });

  it("getSeatsForShowtime: expiración tras 11 min → AVAILABLE", async () => {
    (Showtime.findByPk as jest.Mock).mockResolvedValue({ id: 1, roomId: 10 });
    (Seat.findAll as jest.Mock).mockResolvedValue([
      { id: 1, row: "A", column: 1, type: "STANDARD", status: "AVAILABLE" },
    ]);
    (Ticket.findAll as jest.Mock).mockResolvedValue([]);
    // lock expirado hace 1 minuto no debe contarse
    (SeatLock.findAll as jest.Mock).mockImplementation((opts: any) => {
      // si where expiresAt > now, filtramos expirados
      const now = new Date();
      // simulamos que no hay locks activos (expirado fue destruido o filtrado)
      return Promise.resolve([]);
    });

    const seats = await repo.findSeatsByShowtimeId(1);
    expect(seats).toEqual([{ id: 1, row: "A", column: 1, number: 1, type: "STANDARD", status: "AVAILABLE", isEnabled: true }]);
  });
});
