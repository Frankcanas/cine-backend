import { transporter } from '../config/mailer.config';
import { IEmailService, SendEmailDto } from './interfaces/email.service.interface';

export class EmailService implements IEmailService {
  async send(options: SendEmailDto): Promise<void> {
    const mailOptions = {
      from: `"Tu Aplicación" <${process.env.SMTP_USER}>`,
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

  async sendUserCreationEmail(to: string): Promise<void> {
    const mailOptions = {
      from: `"Riwi-Cine" <${process.env.SMTP_USER}>`,
      to,
      subject: '¡Bienvenido a Riwi Cine!',
      text: 'Bienvenido(a) a Riwi Cine! Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión y disfrutar de todas nuestras funciones.',
      html: `
        <p>¡Bienvenido(a) a Riwi Cine!</p>
        <p>Tu cuenta ha sido creada correctamente.</p>
        <p>Ahora puedes iniciar sesión y disfrutar de todas nuestras funciones.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  }

  async passwordRecoveryEmail(to: string, token: string): Promise<void> {
    const mailOptions = {
      from: `"Riwi-Cine" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Recuperación de contraseña',
      text: `Tu token para recuperar la contraseña es: ${token}. Expira en 15 minutos.`,
      html: `
        <p>Recuperación de contraseña</p>
        <p>Tu token para recuperar la contraseña es: <b>${token}</b>.</p>
        <p>Expira en 15 minutos.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  }
}
