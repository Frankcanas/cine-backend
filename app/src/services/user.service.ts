import crypto from "crypto";
import { Op } from "sequelize";
import User from "../models/user.model";
import Membership from "../models/membreship.model";
import Bonus from "../models/bonus.model";
import Order from "../models/order.model";
import SeatLock from "../models/seat-lock.model";
import { CreateUserDto, PasswordValidationDto } from "../dto/create-user.dto";
import { UserProfileDto } from "../dto/user-profile.dto";
import { UpdateProfileDto } from "../dto/update-profile.dto";
import repository from "../repositories/user.repository";
import { IUserService } from "./interfaces/user.service.interface";
import { hashPassword } from "../utils/password";
import { AuthService as TokenService } from "./token.service";
import { TokenRepository } from "../repositories/token.repository";
import verifiedUserRepository from "../repositories/verified-user.repository";
import { EmailService } from "./email.service";
import { generateMembershipQr } from "../utils/qr";

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

        // Auto-asignación de membresía base (HU-006) - nivel Bronce
        let defaultMembership = await Membership.findOne({ where: { name: "Clásica" } });
        if (!defaultMembership) {
            defaultMembership = await Membership.create({
                name: "Clásica",
                level: "Bronce",
                price: 0,
                durationDays: 365,
                description: "Membresía inicial Bronce con acumulación básica de puntos y descuentos 5%.",
                discountPercentage: 5,
                pointsPerPurchase: 10,
            } as any);
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

        // QR único RN-033
        const membershipCode = (user as any).membershipCode || null;
        let qrCodeDataUrl: string | null = null;
        if (membershipCode) {
            try {
                qrCodeDataUrl = await generateMembershipQr(membershipCode);
            } catch { qrCodeDataUrl = null; }
        }

        // Bonos disponibles
        let bonos: any[] = [];
        try {
            const bonusRows = await Bonus.findAll({ where: { userId, isUsed: false }, order: [["expiresAt", "ASC"]] });
            bonos = bonusRows.map((b: any) => ({
                id: b.id,
                code: b.code,
                amount: Number(b.amount),
                balance: Number(b.balance),
                description: b.description,
                isUsed: b.isUsed,
                expiresAt: b.expiresAt,
            }));
        } catch { bonos = []; }

        // Historial compras (Orders)
        let historialCompras: any[] = [];
        try {
            const orders = await Order.findAll({ where: { userId }, order: [["createdAt", "DESC"]], limit: 20 });
            historialCompras = orders.map((o: any) => ({
                id: o.id,
                total: Number(o.total),
                status: o.status,
                paymentMethod: o.paymentMethod,
                createdAt: o.createdAt,
            }));
        } catch { historialCompras = []; }

        // Reservas activas (SeatLocks vigentes)
        let reservasActivas: any[] = [];
        try {
            const locks = await SeatLock.findAll({
                where: { userId, status: "LOCKED", expiresAt: { [Op.gt]: new Date() } },
                order: [["expiresAt", "ASC"]],
                limit: 20,
            });
            reservasActivas = locks.map((l: any) => ({
                id: l.id,
                showtimeId: l.showtimeId,
                seatId: l.seatId,
                status: l.status,
                expiresAt: l.expiresAt,
            }));
        } catch { reservasActivas = []; }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            city: user.city,
            photoUrl: (user as any).photoUrl || null,
            notificationPreference: user.notificationPreference ?? true,
            membership: {
                active,
                level: membership?.level || null,
                points: user.points,
                membershipName: membership?.name || null,
                benefits: membership?.description || null,
                expiresAt,
                membershipCode,
                qrCode: membershipCode,
                qrCodeDataUrl,
                discountPercentage: (membership as any)?.discountPercentage ?? 0,
            },
            bonos,
            historialCompras,
            historialPuntos: user.points || 0,
            reservasActivas,
        } as UserProfileDto;

    }

    async updateProfile(userId: number, data: UpdateProfileDto): Promise<User | null> {
        const user = await repository.findByid(userId);
        if (!user) {
            return null;
        }
        if (data.name) user.name = data.name;
        if (data.phoneNumber) user.phoneNumber = data.phoneNumber;
        if (data.city !== undefined) (user as any).city = data.city;
        if (data.photoUrl !== undefined) (user as any).photoUrl = data.photoUrl;
        if (data.notificationPreference !== undefined) (user as any).notificationPreference = data.notificationPreference;

        // RN-034: actualización de correo requiere nueva validación
        if (data.email && data.email !== user.email) {
            if (!data.email.includes("@")) {
                const err: any = new Error("Email inválido");
                err.statusCode = 400;
                throw err;
            }
            const existing = await repository.findByEmail(data.email);
            if (existing) {
                const err: any = new Error("El correo ya está registrado");
                err.statusCode = 409;
                throw err;
            }
            user.email = data.email;
            (user as any).isVerified = false;
            (user as any).isActive = false;
            await user.save();
            try {
                await this.tokenService.requestVerificationToken(user.id, user.email);
            } catch (e) {
                console.error("Error al reenviar token tras cambio de email", e);
            }
            return user;
        }

        await user.save();
        return user;
    }
}

export default new UserService();