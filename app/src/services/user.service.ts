// app/src/services/user.service.ts

import User from "../models/user.model";
import { CreateUserDto, PasswordValidationDto } from "../dto/create-user.dto";
import repository from "../repositories/user.repository";
import { IUserService } from "./interfaces/user.service.interface";
import { hashPassword } from "../utils/password";

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

        return await repository.create(dto);
    }

    async findAll(): Promise<User[]> {
        return await repository.findAll();
    }

    async findById(id: number): Promise<User | null> {
        return await repository.findByid(id);
    }
}

export default new UserService();