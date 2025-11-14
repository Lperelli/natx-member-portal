'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import { login } from '@/lib/server-actions/auth-actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

type FormState = {
  success: boolean;
  errors?: Record<string, string[]>;
  next?: string;
};

const initialState: FormState = {
  success: false
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" isLoading={pending}>
      Sign in
    </Button>
  );
}

function FieldError({ message }: { message?: string[] }) {
  if (!message?.length) return null;
  return <p className="mt-1 text-xs font-medium text-danger">{message[0]}</p>;
}

export function LoginForm({ defaultEmail = '' }: { defaultEmail?: string }) {
  const [state, formAction] = useFormState<FormState, FormData>(login, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.push(state.next ?? '/dashboard');
    }
  }, [router, state.next, state.success]);

  return (
    <form className="space-y-6" action={formAction}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@company.com"
            defaultValue={defaultEmail}
          />
          <FieldError message={state.errors?.email} />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" placeholder="Enter your password" />
          <FieldError message={state.errors?.password} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Checkbox name="rememberMe" label="Remember me for 30 days" />
        <Link
          href="/forgot-password"
          className="text-sm font-semibold text-primary hover:text-primary-dark"
        >
          Forgot password?
        </Link>
      </div>

      <SubmitButton />

      <p className="text-xs text-neutral-soft text-center">
        Not a member yet?{' '}
        <a
          href="https://thenatx.com/apply-for-membership"
          target="_blank"
          rel="noreferrer"
          className="font-semibold"
        >
          Apply for membership →
        </a>
      </p>
    </form>
  );
}
