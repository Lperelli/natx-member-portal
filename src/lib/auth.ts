import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { addDays, addHours } from 'date-fns';
import { prisma } from '@/lib/prisma';
import type { Session, User } from '@prisma/client';
import type { UserRole } from '@/types/domain';

const SESSION_COOKIE = 'natx_session_token';
const SESSION_TTL_DAYS = 7;
const SESSION_TTL_EXTENDED_DAYS = 30;

export type SessionWithUser = Session & { user: User };

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

function generateToken(bytes = 32) {
  return randomBytes(bytes).toString('hex');
}

export async function createSession(userId: string, rememberMe: boolean) {
  const token = generateToken();
  const expires = addDays(new Date(), rememberMe ? SESSION_TTL_EXTENDED_DAYS : SESSION_TTL_DAYS);

  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt: expires,
      rememberMe
    }
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires
  });
}

export async function destroySession(token?: string | null) {
  const cookieStore = await cookies();
  const sessionToken = token ?? cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionToken) return;

  await prisma.session.deleteMany({ where: { token: sessionToken } });
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionWithUser | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionToken) return null;

  const session = await prisma.session.findUnique({
    where: { token: sessionToken },
    include: { user: true }
  });

  if (!session) {
    cookieStore.delete(SESSION_COOKIE);
    return null;
  }

  if (session.expiresAt < new Date()) {
    await destroySession(sessionToken);
    return null;
  }

  return session;
}

export async function requireAuth(options?: { role?: UserRole; redirectTo?: string }) {
  const session = await getSession();
  const redirectTo = options?.redirectTo ?? '/login';
  if (!session) {
    const headerStore = await headers();
    const currentUrl = headerStore.get('x-pathname') ?? '';
    const target = currentUrl ? `${redirectTo}?next=${encodeURIComponent(currentUrl)}` : redirectTo;
    redirect(target);
  }

  if (options?.role && session.user.role !== options.role) {
    redirect(session.user.role === 'ADMIN' ? '/admin' : '/dashboard');
  }

  return session;
}

export async function createPasswordResetToken(userId: string) {
  const token = generateToken(24);
  const expiresAt = addHours(new Date(), 2);

  await prisma.passwordResetToken.create({
    data: { userId, token, expiresAt }
  });

  return { token, expiresAt };
}

export async function consumePasswordResetToken(token: string) {
  const record = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true }
  });

  if (!record) return null;
  if (record.expiresAt < new Date()) {
    await prisma.passwordResetToken.delete({ where: { token } });
    return null;
  }

  await prisma.passwordResetToken.delete({ where: { token } });
  return record.user;
}
