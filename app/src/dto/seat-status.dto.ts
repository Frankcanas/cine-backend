export interface SeatStatusDto {
  id: number;
  row: string;
  column: number;
  /** Alias para compatibilidad Postman: `number` == `column` */
  number?: number;
  type: string; // STANDARD | PREFERENTIAL | VIP
  status: string; // AVAILABLE | OCCUPIED | LOCKED | DISABLED
  isEnabled: boolean;
}