import {Request, Response} from 'express';
import { EmailService } from '../services/email.service';

const emailService = new EmailService();

export const EmailController = async (req: Request, res: Response) : Promise <void> =>{
    try {
        const {to,subject,html} = req.body;

        await emailService.send ({to,subject,html});

        res.status(200).json({
            succes: true,
            message: 'Correo enviado'
        });
    } catch (error:any){
        res.status(500).json({
            succes: false,
            error: error.message || 'Error procesando el envio'
        });
    }
};