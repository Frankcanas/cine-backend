import { Request, Response } from "express";
import marketingEmailService from "../services/marketing.email.service";

export const getMarketingMemberships = async (_req: Request, res: Response): Promise<Response> => {
    try {
        const memberships = await marketingEmailService.getMembershipsForMarketing();
        return res.status(200).json(memberships);
    } catch (error: any) {
        return res.status(500).json({ error: error.message || "Error al obtener las membresías para marketing" });
    }
};

export const sendMembershipMarketingEmails = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { membershipId, email } = req.body;

        if (!membershipId && !email) {
            return res.status(400).json({ error: "Debes enviar membershipId o email." });
        }

        if (email) {
            if (!email.includes("@")) {
                return res.status(400).json({ error: "El correo electrónico es inválido." });
            }

            const result = await marketingEmailService.sendMarketingCampaignToEmail(email, Number(membershipId));
            return res.status(200).json({
                message: "Correo de marketing enviado correctamente.",
                ...result,
            });
        }

        const result = await marketingEmailService.sendMarketingCampaignForMembership(Number(membershipId));

        return res.status(200).json({
            message: "Correos de marketing enviados correctamente.",
            ...result,
        });
    } catch (error: any) {
        return res.status(500).json({
            error: error.message || "No se pudieron enviar los correos de marketing.",
        });
    }
};
