// app/src/services/user.service.ts

import User from "../models/user.model";
import { CreateUserDto, PasswordValidationDto } from "../dto/create-user.dto";
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
}

export default new UserService();