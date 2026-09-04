import crypto from "crypto";
import User from "../models/user.model";
import Membership from "../models/membreship.model";
import { CreateUserDto, PasswordValidationDto } from "../dto/create-user.dto";
import { UserProfileDto } from "../dto/user-profile.dto";
import repository from "../repositories/user.repository";
import { IUserService } from "./interfaces/user.service.interface";
import { hashPassword } from "../utils/password";
import { AuthService as TokenService } from "./token.service";
import { TokenRepository } from "../repositories/token.repository";
import verifiedUserRepository from "../repositories/verified-user.repository";
import { EmailService } from "./email.service";

function validatePassword(password: string): PasswordValidationDto {
    const lowercase = /[a-z]/.test(password);
    const uppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const specialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const validLenght = typeof password === 'string' && password.length >= 10;
    const isValid = !!password && lowercase && uppercase && hasNumber && specialCharacter && validLenght;
    return { lowercase, uppercase, hasNumber, specialCharacter, validLenght, isValid };
}

class UserService implements IUserService {
    private tokenService: TokenService;

    constructor() {
        this.tokenService = new TokenService(
            new TokenRepository(),
            verifiedUserRepository,
            new EmailService()
        );
    }

    async create(dto: CreateUserDto): Promise<User> {
        dto.notificationPreference = dto.notificationPreference ?? dto.preferenciaNotificaciones ?? true;

        const passwordStatus: PasswordValidationDto = validatePassword(dto.password);
        if (!passwordStatus.isValid) {
            const message = 'La contraseña debe tener mayúscula, minúscula, número, carácter especial y 10 o más caracteres.';
            const err: any = new Error(message);
            err.code = 'INVALID_PASSWORD';
            throw err;
        }

        dto.passwordStatus = passwordStatus;
        dto.password = await hashPassword(dto.password);

        // Auto-asignación de membresía base (HU-006)
        let defaultMembership = await Membership.findOne({ where: { name: "Clásica" } });
        if (!defaultMembership) {
            defaultMembership = await Membership.create({
                name: "Clásica",
                level: "1",
                price: 0,
                durationDays: 365,
                description: "Membresía inicial con acumulación básica de puntos y descuentos en funciones seleccionadas.",
            });
        }

        const membershipCode = `MEM-${crypto.randomBytes(3).toString("hex").toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

        const userData: any = {
            ...dto,
            membershipId: defaultMembership.id,
            membershipStartDate: new Date(),
            membershipCode,
            points: 0,
            isVerified: false,
            isActive: false,
        };

        const createdUser = await repository.create(userData);

        // Envío de correo de bienvenida
        try {
            const emailService = new EmailService();
            await emailService.sendUserCreationEmail(createdUser.email);
        } catch (error) {
            console.error("Error al enviar correo de bienvenida:", error);
        }

        // Generar token de verificación de correo por 24 horas (HU-006)
        try {
            await this.tokenService.requestVerificationToken(createdUser.id, createdUser.email);
        } catch (mailErr) {
            console.error("Error al enviar correo de activación:", mailErr);
        }

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
            notificationPreference: user.notificationPreference ?? true,
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

    async updateProfile(userId: number, data: { name?: string; phoneNumber?: string; city?: string }): Promise<User | null> {
        const user = await repository.findByid(userId);
        if (!user) {
            return null;
        }
        if (data.name) user.name = data.name;
        if (data.phoneNumber) user.phoneNumber = data.phoneNumber;
        if (data.city) user.city = data.city;
        await user.save();
        return user;
    }
}

export default new UserService();