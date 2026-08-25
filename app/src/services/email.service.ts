import { transporter } from '../config/mailer.config';
import { IEmailService, SendEmailDto } from './interfaces/email.service.interface';

export class EmailService implements IEmailService {
  async send(options: SendEmailDto): Promise<void> {
    const mailOptions = {
      from: `"Aplicación" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    await transporter.sendMail(mailOptions);
  }

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const mailOptions = {
      from: `"Riwi-Cine" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Código de verificación de seguridad',
      text: `Tu código de verificación es: ${token}. Expira en 15 minutos.`,
      html: `<p>Tu código de verificación es: <b>${token}</b>.</p><p>Expira en 15 minutos.</p>`,
    };

    await transporter.sendMail(mailOptions);
  }
}
