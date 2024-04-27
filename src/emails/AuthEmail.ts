import { transporter } from "../config/nodemailer";

interface IEmail {
    email: string
    name: string
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async (user: IEmail) => {
        const info = await transporter.sendMail({
            from: 'UpTask <admin@uptask.com>',
            to: user.email,
            subject: ' UpTask - Confirma tu cuenta',
            text: ' UpTask - Confirma tu cuenta - text',
            html: `<p>Hola: ${user.name}, has creado tu cuenta en UpTask, ya casi está todo listo, solo debes confirmar tu cuenta</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar cuenta</a>             
                <p>E ingresa el código: <b>${user.token}</b></p>
                <p>Este Token expira en 10 minutos</p>
            `
        })
        console.log('mensaje enviado', info.messageId)
    }

    static sendPasswordResetToken = async (user: IEmail) => {
        const info = await transporter.sendMail({
            from: 'UpTask <admin@uptask.com>',
            to: user.email,
            subject: ' UpTask - Restablece tu Password',
            text: ' UpTask - Restablece tu Password - text',
            html: `<p>Hola: ${user.name}, has solicitado restablecer tu password.</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/new-password">Restablecer Password</a>             
                <p>E ingresa el código: <b>${user.token}</b></p>
                <p>Este Token expira en 10 minutos</p>
            `
        })
        console.log('mensaje enviado', info.messageId)
    }
}