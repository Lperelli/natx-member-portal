import nodemailer from 'nodemailer';
import { format } from 'date-fns';

type PasswordResetEmailInput = {
  email: string;
  name: string;
  token: string;
  expiresAt: Date;
};

const transporter =
  process.env.EMAIL_SERVER_HOST && process.env.EMAIL_SERVER_USER
    ? nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT ?? 587),
        secure: false,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      })
    : null;

export async function sendPasswordResetEmail({
  email,
  name,
  token,
  expiresAt
}: PasswordResetEmailInput) {
  const resetLink = `${process.env.NEXTAUTH_URL ?? 'http://localhost:3000'}/reset-password?token=${token}`;
  const html = `
    <div style="font-family: Inter, Arial, sans-serif; color: #1f2937;">
      <h2 style="color: #204668;">Reset your NATX password</h2>
      <p>Hi ${name.split(' ')[0]},</p>
      <p>We received a request to reset your password for the NATX Premium Member Portal. Click the link below to set a new password:</p>
      <p style="margin: 24px 0;">
        <a href="${resetLink}" style="background-color: #5aacd6; color: #ffffff; padding: 12px 20px; border-radius: 8px; text-decoration: none;">Reset Password</a>
      </p>
      <p>This link will expire at <strong>${format(expiresAt, "MMMM d, yyyy 'at' h:mm a (z)")}</strong>.</p>
      <p>If you didn’t request this change, you can safely ignore this email.</p>
      <p>— The NATX Member Success Team</p>
    </div>
  `;

  if (!transporter) {
    console.warn('Email transporter is not configured. Password reset email not sent.');
    console.info(`Reset link for ${email}: ${resetLink}`);
    return;
  }

  await transporter.sendMail({
    to: email,
    from: process.env.EMAIL_FROM ?? 'notifications@natxportal.com',
    subject: 'Reset your NATX member portal password',
    html
  });
}
