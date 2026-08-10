// app/src/models/upcoming-notification.model.ts
//
// NOTA: esta entidad no existe en el MER (no hay UPCOMING_NOTIFICATION).
// Se conserva porque ya estaba implementada y en uso; solo se corrigió
// la ruta de importación de "../user.model" a "./user.model".

import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import User from "./user.model";
import Movie from "./movie.model";

export interface UpcomingNotificationAttributes {
  id: number;
  userId: number;
  movieId: number;
  notificationDate: Date;
  channel?: string;
  status?: string;
  message?: string;
}

@Table({
  tableName: "upcoming_notifications",
  timestamps: true,
})
export class UpcomingNotification extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  @BelongsTo(() => User)
  user?: User;

  @ForeignKey(() => Movie)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  movieId!: number;

  @BelongsTo(() => Movie)
  movie?: Movie;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  notificationDate!: Date;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
    defaultValue: "EMAIL",
  })
  channel!: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
    defaultValue: "PENDING",
  })
  status!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  message?: string;
}

export type UpcomingNotificationCreationAttributes = Partial<UpcomingNotificationAttributes>;

export default UpcomingNotification;
