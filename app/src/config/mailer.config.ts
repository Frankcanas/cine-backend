import nodemailer from 'nodemailer';

const host = (process.env.SMTP_HOST || 'smtp.gmail.com').trim();
const port = Number((process.env.SMTP_PORT || '465').trim());

export const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
        user: process.env.SMTP_USER ? process.env.SMTP_USER.trim() : '',
        pass: process.env.SMTP_PASS ? process.env.SMTP_PASS.trim() : '',
    },
});