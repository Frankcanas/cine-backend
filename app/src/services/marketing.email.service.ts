import User from "../models/user.model";
import Membership from "../models/membreship.model";
import { EmailService } from "./email.service";

export class MarketingEmailService {
    private emailService: EmailService;

    constructor() {
        this.emailService = new EmailService();
    }

    async getMembershipsForMarketing(): Promise<Membership[]> {
        return await Membership.findAll({
            attributes: ["id", "name", "description", "level", "price"],
        });
    }

    async getUsersForMarketing(): Promise<User[]> {
        return await User.findAll({
            where: {
                notificationPreference: true,
            },
            include: [{ model: Membership }],
        });
    }

    async sendMarketingCampaignToEmail(email: string, membershipId: number): Promise<{ sent: number; membershipName: string; email: string }> {
        const membership = await Membership.findByPk(membershipId);

        if (!membership) {
            throw new Error("Membresía no encontrada");
        }

        if (!email || !email.includes("@")) {
            throw new Error("Email inválido");
        }

        const description = membership.description || `Descubre los beneficios exclusivos de ${membership.name}.`;

        await this.emailService.marketingEmails(
            email,
            email.split("@")[0] || "Cliente",
            membership.name,
            description,
        );

        return {
            sent: 1,
            membershipName: membership.name,
            email,
        };
    }

    async sendMarketingCampaignForMembership(membershipId: number): Promise<{ sent: number; membershipName: string }> {
        const membership = await Membership.findByPk(membershipId);

        if (!membership) {
            throw new Error("Membresía no encontrada");
        }

        const users = (await this.getUsersForMarketing()).filter(
            (user) => user.email && user.email.includes("@")
        );

        if (!users.length) {
            return {
                sent: 0,
                membershipName: membership.name,
            };
        }

        const description = membership.description || `Descubre los beneficios exclusivos de ${membership.name}.`;

        for (const user of users) {
            await this.emailService.marketingEmails(
                user.email,
                user.name,
                membership.name,
                description,
            );
        }

        return {
            sent: users.length,
            membershipName: membership.name,
        };
    }

    async sendMarketingCampaign(): Promise<void> {
        const memberships = await this.getMembershipsForMarketing();

        for (const membership of memberships) {
            const users = (await this.getUsersForMarketing()).filter(
                (user) => user.email && user.email.includes("@")
            );
            const description = membership.description || `Descubre los beneficios exclusivos de ${membership.name}.`;

            for (const user of users) {
                await this.emailService.marketingEmails(
                    user.email,
                    user.name,
                    membership.name,
                    description,
                );
            }
        }
    }
}

export default new MarketingEmailService();
