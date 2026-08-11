// app/src/repositories/interfaces/showtime.repository.interface.ts

import Showtime, { ShowtimeCreationAttributes } from "../../models/showtime.model";

export interface IShowtimeRepository {
  create(showtimeData: ShowtimeCreationAttributes): Promise<Showtime>;
  findAll(): Promise<Showtime[]>;
  findById(id: number): Promise<Showtime | null>;
  findByMovieId(movieId: number): Promise<Showtime[]>;
  findByRoomId(roomId: number): Promise<Showtime[]>;
  update(id: number, showtimeData: Partial<ShowtimeCreationAttributes>): Promise<[number]>;
  delete(id: number): Promise<number>;
}
