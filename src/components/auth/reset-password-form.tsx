'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { resetPassword } from '@/lib/server-actions/auth-actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type FormState = {
  success: boolean;
  errors?: Record<string, string[]>;
};

const initialState: FormState = {
  success: false
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" isLoading={pending}>
      Reset password
    </Button>
  );
}

function FieldError({ message }: { message?: string[] }) {
  if (!message?.length) return null;
  return <p className="mt-1 text-xs font-medium text-danger">{message[0]}</p>;
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction] = useFormState<FormState, FormData>(resetPassword, initialState);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="space-y-6 text-center">
        <div className="rounded-2xl border border-primary bg-primary-light/70 px-6 py-5 text-primary-dark">
          <h3 className="text-xl font-semibold mb-2">Password updated</h3>
          <p className="text-sm">
            You can now sign in with your new password. Redirecting you to the login page…
          </p>
        </div>
        <Button
          type="button"
          onClick={() => (window.location.href = '/login?status=password-reset')}
          className="w-full"
        >
          Back to login
        </Button>
      </div>
    );
  }

  return (
    <form
      className="space-y-6"
      action={async (formData) => {
        formData.append('token', token);
        const result = await formAction(formData);
        if (result?.success) {
          setDone(true);
          setTimeout(() => {
            window.location.href = '/login?status=password-reset';
          }, 1500);
        }
      }}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Create a strong password"
          />
          <FieldError message={state.errors?.password} />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
          />
          <FieldError message={state.errors?.confirmPassword} />
        </div>
        <FieldError message={state.errors?.token} />
      </div>
      <SubmitButton />
    </form>
  );
}
