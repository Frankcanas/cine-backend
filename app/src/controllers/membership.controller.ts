// app/src/controllers/membership.controller.ts

import { Request, Response } from "express";
import membreshipService from "../services/membreship.service";
import { CreateMembershipDto } from "../dto/create.membreship.dto";

export const createMembership = async (req: Request, res: Response): Promise<Response> => {
      try {
        const dto: CreateMembershipDto = req.body;
    
        // Delegar al servicio
        const membership = await membreshipService.create(dto);
    
        // Retornar código 201 Created
        return res.status(201).json(membership);
      } catch (error: any) {
        // Si hubo un error de validación o servidor, retornar 400 o 500
        return res.status(400).json({
          error: error.message,
        });
      }
    };

export const getAllMemberships = async (req: Request, res: Response): Promise<Response> => {
    try {
        const memberships = await membreshipService.getAll();
        return res.status(200).json(memberships);
    } catch (error: any) {
        return res.status(500).json({
            error: error.message,
        });
    }
};