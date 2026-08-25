/**
 * Opciones requeridas para estructurar un correo.
 */
export interface SendEmailDto {
    to: string;
    subject: string;
    html: string;
}

/**
 * Contrato del Servicio de Email (Infraestructura).
 */
export interface IEmailService {
    send(options: SendEmailDto): Promise<void>;
    sendVerificationEmail(to: string, token: string): Promise<void>;
    sendUserCreationEmail(to: string): Promise<void>;
    passwordRecoveryEmail(to: string, token: string): Promise<void>;
}