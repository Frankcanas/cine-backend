import { SendMailOptions } from "nodemailer";
import { transporter } from '../config/mailer.config';
import { IEmailService, SendEmailDto } from './interfaces/email.service.interface';

export class EmailService implements IEmailService {
    async send (options: SendEmailDto): Promise <void> {
        try {
            const mailOptions: SendMailOptions = {
                from: `Riwi Cine <${process.env.EMAIL_USER}>`,
                to: options.to,
                subject: options.subject,
                html: options.html,
            };

            await transporter.sendMail(mailOptions);
            console.log('Correo enviado exitosamente.')
        } catch (error){
            console.error('Error al enviar el correo', error)
            throw error;
        }
    }
}