// app/src/services/user.service.ts

import User from "../models/user.model";
import { CreateUserDto, PasswordValidationDto } from "../dto/create-user.dto";
import { UserProfileDto } from "../dto/user-profile.dto";
import repository from "../repositories/user.repository";
import { IUserService } from "./interfaces/user.service.interface";
import { hashPassword, validatePassword } from "../utils/password";
import { EmailService } from "./email.service";

class UserService implements IUserService {

    async create(dto: CreateUserDto): Promise<User> {
        const passwordStatus: PasswordValidationDto = validatePassword(dto.password);
        if (!passwordStatus.isValid) {
            const message = 'La contraseña debe tener mayúscula, minúscula, número, carácter especial y 10 o más caracteres.';
            const err: any = new Error(message);
            err.code = 'INVALID_PASSWORD';
            throw err;
        }

        dto.passwordStatus = passwordStatus;
        dto.password = await hashPassword(dto.password);

        const createdUser = await repository.create(dto);
        const emailService = new EmailService();
        await emailService.sendUserCreationEmail(createdUser.email);
        return createdUser;
    }

    async findAll(): Promise<User[]> {
        return await repository.findAll();
    }

    async findById(id: number): Promise<User | null> {
        return await repository.findByid(id);
    }

    async getProfile(userId: number): Promise<UserProfileDto | null> {

        const user = await repository.findByIdWithMembership(userId);

        if (!user) {
            return null;
        }

        const membership = user.membership;

        let active = false;
        let expiresAt: Date | null = null;

        if (membership && user.membershipStartDate) {
            const startDate = new Date(user.membershipStartDate);
            expiresAt = new Date(startDate);
            expiresAt.setDate(expiresAt.getDate() + membership.durationDays);
            active = expiresAt.getTime() > Date.now();
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            city: user.city,
            membership: {
                active,
                level: membership?.level || null,
                points: user.points,
                membershipName: membership?.name || null,
                benefits: membership?.description || null,
                expiresAt
            }

        };

    }
}

export default new UserService();