import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AuthCard } from '@/components/auth/auth-card';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';

type ResetPasswordPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const token =
    typeof resolvedSearchParams?.token === 'string' ? resolvedSearchParams.token : '';

  if (!token) {
    notFound();
  }

  return (
    <AuthCard
      title="Reset your password"
      subtitle="Create a new password to regain access to your NATX member account."
    >
      <div className="space-y-6">
        <ResetPasswordForm token={token} />
        <div className="text-sm text-neutral-soft text-center">
          Changed your mind?{' '}
          <Link href="/login" className="font-semibold text-primary hover:text-primary-dark">
            Back to login
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}
