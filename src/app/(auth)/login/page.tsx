import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth';
import { AuthCard } from '@/components/auth/auth-card';
import { LoginForm } from '@/components/auth/login-form';

type LoginPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getSession();
  if (session) {
    redirect('/dashboard');
  }

  const nextParam = typeof searchParams?.next === 'string' ? searchParams.next : undefined;
  if (nextParam) {
    const cookieStore = cookies();
    cookieStore.set('natx_next_path', nextParam, {
      httpOnly: true,
      sameSite: 'lax'
    });
  }

  return (
    <AuthCard
      title="Sign in to NATX"
      subtitle="Access curated events, community insights, and premium member resources."
    >
      <LoginForm defaultEmail={typeof searchParams?.email === 'string' ? searchParams.email : ''} />
    </AuthCard>
  );
}
