// app/src/repositories/membership.repository.ts

import Membershi, { Membership } from "../models/membreship.model";
import { CreateMembershipDto } from "../dto/create.membreship.dto";

class MembershipRepository {

    /**
     * Esto es para crear el registro de la membresia de en la base de datos 
     */

    async create(dto: CreateMembershipDto): Promise<Membership>{
        return await Membership.create({...dto});
    }


    /**
     * Revisa y busca una membresia por el nombre para evitar comflictos o que este duplciado
     */

    async findByName(name: string): Promise<Membership | null>{
        return await Membership.findOne({ where: { name}});
    }

    /**
     * Obtiene todas las membresías de la base de datos
     */
    async findAll(): Promise<Membership[]> {
        return await Membership.findAll();
    }
}   

export default new MembershipRepository();