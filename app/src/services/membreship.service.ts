// app/src/services/membership.service.ts

import membreshipRepository from "../repositories/membreship.repository";
import { CreateMembershipDto } from "../dto/create.membreship.dto";

class MembershipService {

    async create(dto: CreateMembershipDto) {

        // se valida el preico positivo

        if (dto.price <=0) {
            throw new Error("El precio de la membresia debe ser mayor a 0");
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