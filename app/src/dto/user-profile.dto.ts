// app/src/dto/user-profile.dto.ts

/**
 * DTO - Perfil de Usuario
 * -----------------------
 * Representa la respuesta de `GET /api/users/profile`: los datos personales
 * del usuario autenticado más un sub-objeto con el estado de su membresía.
 */

export interface MembershipStatusDto {
  active: boolean;
  level: string | null;
  points: number;
  membershipName: string | null;
  benefits: string | null;
  expiresAt: Date | null;
  membershipCode: string | null;
  qrCode: string | null;
  qrCodeDataUrl: string | null;
  discountPercentage: number;
}

export interface BonusDto {
  id: number;
  code: string;
  amount: number;
  balance: number;
  description?: string;
  isUsed: boolean;
  expiresAt?: Date | null;
}

export interface OrderHistoryDto {
  id: number;
  total: number;
  status: string;
  paymentMethod: string;
  createdAt: Date;
}

export interface ReservationDto {
  id: number;
  showtimeId: number;
  seatId: number;
  status: string;
  expiresAt: Date;
}

export interface UserProfileDto {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  city?: string;
  photoUrl?: string | null;
  notificationPreference: boolean;
  membership: MembershipStatusDto;
  bonos: BonusDto[];
  historialCompras: OrderHistoryDto[];
  historialPuntos: number;
  reservasActivas: ReservationDto[];
}
