'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

const profileSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  title: z.string().optional(),
  company: z.string().optional(),
  bio: z.string().max(400).optional(),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  region: z.string().optional(),
  industry: z.string().optional()
});

export async function updateProfile(formData: FormData) {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }

  const parsed = profileSchema.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    title: formData.get('title') || undefined,
    company: formData.get('company') || undefined,
    bio: formData.get('bio') || undefined,
    linkedinUrl: formData.get('linkedinUrl') || undefined,
    region: formData.get('region') || undefined,
    industry: formData.get('industry') || undefined
  });

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  await prisma.user.update({
    where: { id: session.userId },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      title: data.title,
      company: data.company,
      bio: data.bio,
      linkedinUrl: data.linkedinUrl || null,
      region: data.region ?? null,
      industry: data.industry ?? null
    }
  });

  await prisma.memberProfile.upsert({
    where: { email: session.user.email },
    update: {
      fullName: `${data.firstName} ${data.lastName}`,
      title: data.title,
      company: data.company,
      bio: data.bio,
      linkedinUrl: data.linkedinUrl || null,
      region: data.region ?? 'CENTRAL',
      industry: data.industry ?? 'OTHER'
    },
    create: {
      email: session.user.email,
      fullName: `${data.firstName} ${data.lastName}`,
      title: data.title,
      company: data.company,
      bio: data.bio,
      linkedinUrl: data.linkedinUrl || null,
      region: data.region ?? 'CENTRAL',
      industry: data.industry ?? 'OTHER',
      memberSince: new Date(),
      profilePhoto: session.user.avatarUrl,
      online: true
    }
  });

  revalidatePath('/dashboard/profile');
  revalidatePath('/dashboard/community');

  return { success: true };
}
