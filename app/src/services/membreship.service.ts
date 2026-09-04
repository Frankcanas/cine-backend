// app/src/services/membership.service.ts

import membreshipRepository from "../repositories/membreship.repository";
import { CreateMembershipDto } from "../dto/create.membreship.dto";

class MembershipService {

    async create(dto: CreateMembershipDto) {

        // se valida el precio no negativo (Bronce puede ser 0)
        if (dto.price <0) {
            throw new Error("El precio de la membresia debe ser mayor o igual a 0");
        }
        // normaliza discountPercentage por nivel si no se envía (RN-032)
        const levelMap: any = { Bronce:5, Plata:10, Oro:15, Platino:25, "1":5, "2":10, "3":15, "4":25 };
        if (dto.level && dto.discountPercentage === undefined && levelMap[dto.level] !== undefined) {
            (dto as any).discountPercentage = levelMap[dto.level];
        }
        if (dto.level && !["Bronce","Plata","Oro","Platino","1","2","3","4"].includes(dto.level)) {
            // permite nivel genérico pero avisa
        }

        // se valida que los nombres de la membresia no esten duplicados

            const existingMembership = await membreshipRepository.findByName(dto.name);
        if (existingMembership) {
              throw new Error(`La membresía con el nombre '${dto.name}' ya existe`);
        }

        // se crea mediante el repositorio 
        return await membreshipRepository.create(dto)
    }

    /**
     * Retorna todas las membresías existentes
     */
    async getAll() {
        return await membreshipRepository.findAll();
    }
}
    export default new MembershipService();