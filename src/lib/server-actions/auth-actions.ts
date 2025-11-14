'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import {
  verifyPassword,
  createSession,
  destroySession,
  createPasswordResetToken,
  consumePasswordResetToken,
  hashPassword
} from '@/lib/auth';
import { sendPasswordResetEmail } from '@/lib/services/email';

const loginSchema = z.object({
  email: z.string().email('Please provide a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional()
});

export async function login(_prevState: unknown, formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    rememberMe: formData.get('rememberMe') === 'on'
  });

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const { email, password, rememberMe } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { success: false, errors: { email: ['Invalid email or password'] } };
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return { success: false, errors: { email: ['Invalid email or password'] } };
  }

  await createSession(user.id, rememberMe ?? false);
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() }
  });

  const cookiesStore = cookies();
  const next = cookiesStore.get('natx_next_path')?.value ?? '/dashboard';
  cookiesStore.delete('natx_next_path');

  return { success: true, next };
}

const forgotPasswordSchema = z.object({
  email: z.string().email('Please provide a valid email')
});

export async function requestPasswordReset(_prevState: unknown, formData: FormData) {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get('email')
  });

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const { email } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { success: true };
  }

  const { token, expiresAt } = await createPasswordResetToken(user.id);

  await sendPasswordResetEmail({
    email: user.email,
    name: `${user.firstName} ${user.lastName}`,
    token,
    expiresAt
  });

  return { success: true };
}

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/,
        'Password must include uppercase, lowercase, and a number'
      ),
    confirmPassword: z.string(),
    token: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match'
  });

export async function resetPassword(_prevState: unknown, formData: FormData) {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
    token: formData.get('token')
  });

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const { token, password } = parsed.data;
  const user = await consumePasswordResetToken(token);

  if (!user) {
    return {
      success: false,
      errors: { token: ['Reset link is invalid or expired. Please request a new reset email.'] }
    };
  }

  const passwordHash = await hashPassword(password);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash }
  });

  await prisma.session.deleteMany({ where: { userId: user.id } });

  return { success: true };
}

export async function logout() {
  await destroySession();
  return { success: true };
}
