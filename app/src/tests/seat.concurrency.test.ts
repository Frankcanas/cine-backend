// @ts-nocheck
// app/src/tests/seat.concurrency.test.ts - HU-010 carrera concurrente
import { describe, it, expect, jest, beforeEach } from "@jest/globals";

jest.mock("../models/seat.model", () => ({
  __esModule: true,
  default: { findAll: jest.fn() },
}));
jest.mock("../models/showtime.model", () => ({
  __esModule: true,
  default: { findByPk: jest.fn() },
}));
jest.mock("../models/ticket.model", () => ({
  __esModule: true,
  default: { findAll: jest.fn() },
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
  },
}));

import Seat from "../models/seat.model";
import Showtime from "../models/showtime.model";
import Ticket from "../models/ticket.model";
import SeatLock from "../models/seat-lock.model";
import { SeatRepository } from "../repositories/seat.repository";
import { UniqueConstraintError } from "sequelize";

describe("SeatRepository - concurrencia (R1)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("Promise.all 2 locks misma silla → solo 1 éxito, otro 409 (UniqueConstraintError)", async () => {
    (Showtime.findByPk as jest.Mock).mockResolvedValue({ id: 1, roomId: 10 });
    (Seat.findAll as jest.Mock).mockResolvedValue([{ id: 1 }]);
    (SeatLock.destroy as jest.Mock).mockResolvedValue(0);
    (Ticket.findAll as jest.Mock).mockResolvedValue([]);
    // primer lock ve 0 active, segundo también (race) pero el create del segundo lanza UniqueConstraintError
    (SeatLock.findAll as jest.Mock).mockResolvedValue([]);
    (SeatLock.findOne as jest.Mock).mockResolvedValue(null);
    let callCount = 0;
    (SeatLock.create as jest.Mock).mockImplementation(async () => {
      callCount++;
      if (callCount === 2) {
        throw new UniqueConstraintError({ message: "unique" } as any);
      }
      return { id: callCount };
    });

    const repo = new SeatRepository();
    const p1 = repo.lockSeats(1, [1], 1, 10);
    const p2 = repo.lockSeats(1, [1], 2, 10);

    const results = await Promise.allSettled([p1, p2]);
    const successes = results.filter((r) => r.status === "fulfilled");
    const failures = results.filter((r) => r.status === "rejected");

    expect(successes.length).toBe(1);
    expect(failures.length).toBe(1);
    expect((failures[0] as PromiseRejectedResult).reason.statusCode).toBe(409);
  });
});
