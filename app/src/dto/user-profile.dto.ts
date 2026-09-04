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
}

export interface UserProfileDto {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  city?: string;
  notificationPreference: boolean;
  membership: MembershipStatusDto;
}
