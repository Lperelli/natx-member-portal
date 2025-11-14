import Link from 'next/link';
import { AuthCard } from '@/components/auth/auth-card';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Forgot your password?"
      subtitle="Enter your email and we will send you a secure link to reset your access."
    >
      <div className="space-y-6">
        <ForgotPasswordForm />
        <div className="text-sm text-neutral-soft text-center">
          Remembered it?{' '}
          <Link href="/login" className="font-semibold text-primary hover:text-primary-dark">
            Back to login
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}
