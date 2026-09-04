// app/src/repositories/showtime.repository.ts

import Showtime, { ShowtimeCreationAttributes } from "../models/showtime.model";
import { IShowtimeRepository } from "./interfaces/showtime.repository.interface";
import Room from "../models/room.model";
import Cinema from "../models/cinema.model";
import Ticket from "../models/ticket.model";
import SeatLock from "../models/seat-lock.model";
import { ShowtimeFilterDto } from "../dto/showtime-filter.dto";
import { Op, WhereOptions } from "sequelize";
import sequelize from "../config/database";
export class ShowtimeRepository implements IShowtimeRepository {
  async create(showtimeData: ShowtimeCreationAttributes): Promise<Showtime> {
    return await Showtime.create(showtimeData);
  }

  async findAll(): Promise<Showtime[]> {
    return await Showtime.findAll();
  }

  async findById(id: number): Promise<Showtime | null> {
    return await Showtime.findByPk(id, {
      include: [{ model: Room, include: [Cinema] }],
    });
  }

  async findByIdWithAvailability(id: number): Promise<any | null> {
    const showtime = await Showtime.findByPk(id, {
      include: [{ model: Room, include: [Cinema] }],
    });
    if (!showtime) return null;
    const sold = await Ticket.count({ where: { showtimeId: id, status: "VALID" } });
    const locked = await SeatLock.count({
      where: { showtimeId: id, status: "LOCKED", expiresAt: { [Op.gt]: new Date() } },
    });
    const capacity = (showtime as any).room?.capacity ?? 0;
    const availableSeats = Math.max(0, capacity - sold - locked);
    const plain = (showtime as any).toJSON ? (showtime as any).toJSON() : { ...showtime };
    return {
      ...plain,
      capacity,
      soldSeats: sold,
      lockedSeats: locked,
      availableSeats,
      availableSeatsReal: availableSeats,
    };
  }

  async findByMovieId(movieId: number): Promise<Showtime[]> {
    return await Showtime.findAll({ where: { movieId } });
  }

  async findByRoomId(roomId: number): Promise<Showtime[]> {
    return await Showtime.findAll({ where: { roomId } });
  }

  async update(id: number, showtimeData: Partial<ShowtimeCreationAttributes>): Promise<[number]> {
    return await Showtime.update(showtimeData, { where: { id } });
  }

  async delete(id: number): Promise<number> {
    return await Showtime.destroy({ where: { id } });
  }
  
  private buildWhere(movieId: number, filters: ShowtimeFilterDto): WhereOptions {
    const andConditions: any[] = [{ movieId }];
    if (filters.format) {
      andConditions.push({ format: { [Op.iLike]: filters.format } });
    }
    if (filters.language) {
      andConditions.push({
        [Op.or]: [
          { language: { [Op.iLike]: filters.language } },
          { audioType: { [Op.iLike]: filters.language } },
        ],
      });
    }
    if (filters.audioType) {
      andConditions.push({ audioType: { [Op.iLike]: filters.audioType } });
    }
    if (filters.fecha) {
      const d = new Date(filters.fecha);
      if (!isNaN(d.getTime())) {
        const start = new Date(d);
        start.setHours(0, 0, 0, 0);
        const end = new Date(d);
        end.setHours(23, 59, 59, 999);
        andConditions.push({ startTime: { [Op.between]: [start, end] } });
      }
    }
    // RN-035: no mostrar funciones ya iniciadas
    andConditions.push({ startTime: { [Op.gt]: new Date() } });
    // RN-036: solo activas
    andConditions.push({ status: "AVAILABLE" });
    if (andConditions.length === 1) return { movieId };
    return { [Op.and]: andConditions } as WhereOptions;
  }

  private buildRoomInclude(filters: ShowtimeFilterDto): any {
    const roomWhere: any = {};
    if (filters.roomId) roomWhere.id = filters.roomId;
    const cinemaWhere: any = {};
    if (filters.cinemaId) cinemaWhere.id = filters.cinemaId;
    const cinemaInclude: any = { model: Cinema };
    if (Object.keys(cinemaWhere).length) {
      cinemaInclude.where = cinemaWhere;
      cinemaInclude.required = true;
    } else {
      cinemaInclude.required = false;
    }
    const roomInclude: any = { model: Room, include: [cinemaInclude] };
    if (Object.keys(roomWhere).length) {
      roomInclude.where = roomWhere;
      roomInclude.required = true;
    }
    return roomInclude;
  }

  async findByMovieWithFilters(movieId: number, filters: ShowtimeFilterDto): Promise<any[]> {
    const where = this.buildWhere(movieId, filters);
    const roomInclude = this.buildRoomInclude(filters);

    const showtimes = await Showtime.findAll({
      where,
      include: [roomInclude],
      order: [["startTime", "ASC"]],
    });

    if (showtimes.length === 0) return showtimes as any[];

    // P0-6: cálculo batch de availableSeats = capacity - sold - locked (evita N+1)
    const ids = showtimes.map((s) => s.id);
    const soldRows: any[] = await Ticket.findAll({
      attributes: ["showtimeId", [sequelize.fn("COUNT", sequelize.col("id")), "cnt"]],
      where: { showtimeId: { [Op.in]: ids }, status: "VALID" },
      group: ["showtimeId"],
      raw: true,
    } as any);
    const lockedRows: any[] = await SeatLock.findAll({
      attributes: ["showtimeId", [sequelize.fn("COUNT", sequelize.col("id")), "cnt"]],
      where: { showtimeId: { [Op.in]: ids }, status: "LOCKED", expiresAt: { [Op.gt]: new Date() } },
      group: ["showtimeId"],
      raw: true,
    } as any);

    const soldMap = new Map<number, number>();
    soldRows.forEach((r: any) => soldMap.set(Number(r.showtimeId), Number(r.cnt)));
    const lockedMap = new Map<number, number>();
    lockedRows.forEach((r: any) => lockedMap.set(Number(r.showtimeId), Number(r.cnt)));

    return showtimes.map((s: any) => {
      const roomCapacity = s.room?.capacity ?? 0;
      const sold = soldMap.get(s.id) ?? 0;
      const locked = lockedMap.get(s.id) ?? 0;
      const computed = Math.max(0, roomCapacity - sold - locked);
      const plain = s.toJSON ? s.toJSON() : { ...s };
      return {
        ...plain,
        availableSeats: computed,
        availableSeatsReal: computed,
        soldSeats: sold,
        lockedSeats: locked,
        capacity: roomCapacity,
      };
    });
  }

  async findByMovieWithFiltersPaginated(
    movieId: number,
    filters: ShowtimeFilterDto
  ): Promise<{ data: any[]; total: number; page: number; totalPages: number }> {
    const where = this.buildWhere(movieId, filters);
    const roomInclude = this.buildRoomInclude(filters);

    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(filters.limit) || 20));
    const offset = (page - 1) * limit;

    const { rows, count } = await Showtime.findAndCountAll({
      where,
      include: [roomInclude],
      order: [["startTime", "ASC"]],
      limit,
      offset,
    });

    if (rows.length === 0) {
      return { data: [], total: count, page, totalPages: Math.ceil(count / limit) };
    }

    const ids = rows.map((s) => s.id);
    const soldRows: any[] = await Ticket.findAll({
      attributes: ["showtimeId", [sequelize.fn("COUNT", sequelize.col("id")), "cnt"]],
      where: { showtimeId: { [Op.in]: ids }, status: "VALID" },
      group: ["showtimeId"],
      raw: true,
    } as any);
    const lockedRows: any[] = await SeatLock.findAll({
      attributes: ["showtimeId", [sequelize.fn("COUNT", sequelize.col("id")), "cnt"]],
      where: { showtimeId: { [Op.in]: ids }, status: "LOCKED", expiresAt: { [Op.gt]: new Date() } },
      group: ["showtimeId"],
      raw: true,
    } as any);

    const soldMap = new Map<number, number>();
    soldRows.forEach((r: any) => soldMap.set(Number(r.showtimeId), Number(r.cnt)));
    const lockedMap = new Map<number, number>();
    lockedRows.forEach((r: any) => lockedMap.set(Number(r.showtimeId), Number(r.cnt)));

    const data = rows.map((s: any) => {
      const roomCapacity = s.room?.capacity ?? 0;
      const sold = soldMap.get(s.id) ?? 0;
      const locked = lockedMap.get(s.id) ?? 0;
      const computed = Math.max(0, roomCapacity - sold - locked);
      const plain = s.toJSON ? s.toJSON() : { ...s };
      return {
        ...plain,
        availableSeats: computed,
        availableSeatsReal: computed,
        soldSeats: sold,
        lockedSeats: locked,
        capacity: roomCapacity,
      };
    });

    return { data, total: count, page, totalPages: Math.ceil(count / limit) };
  }
}
