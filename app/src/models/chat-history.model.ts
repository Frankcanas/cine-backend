// app/src/models/chat-history.model.ts

import { Table, Column, Model, DataType, ForeignKey } from "sequelize-typescript";
import User from "./user.model";

export interface ChatHistoryAttributes {
  id: number;
  userId: number;
  sessionId: string;
  message: string;
  messageRole: string;
  date: Date;
}

@Table({
  tableName: "chat_histories",
  timestamps: true,
})
export class ChatHistory extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => User as any)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "user_id",
  })
  userId!: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: "session_id",
  })
  sessionId!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  message!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: "message_role",
  })
  messageRole!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  date!: Date;
}

export type ChatHistoryCreationAttributes = Partial<ChatHistoryAttributes>;

export default ChatHistory;