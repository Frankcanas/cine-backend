// app/src/dto/update-profile.dto.ts - HU-008 actualización perfil RN-034
export interface UpdateProfileDto {
  name?: string;
  phoneNumber?: string;
  city?: string;
  photoUrl?: string;
  notificationPreference?: boolean;
  email?: string; // RN-034: requiere re-validación
}
