'use client';

import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { requestPasswordReset } from '@/lib/server-actions/auth-actions';
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
      Send reset link
    </Button>
  );
}

function FieldError({ message }: { message?: string[] }) {
  if (!message?.length) return null;
  return <p className="mt-1 text-xs font-medium text-danger">{message[0]}</p>;
}

export function ForgotPasswordForm() {
  const [state, formAction] = useFormState<FormState, FormData>(requestPasswordReset, initialState);
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    if (state?.success) {
      setSubmitted(true);
    }
  }, [state]);

  return (
    <form
      className="space-y-6"
      action={async (formData) => {
        setSubmitted(false);
        await formAction(formData);
      }}
    >
      <div>
        <Label htmlFor="email">Email address</Label>
        <Input id="email" name="email" type="email" placeholder="you@company.com" />
        <FieldError message={state?.errors?.email} />
      </div>
      <SubmitButton />

      {submitted ? (
        <div className="rounded-xl border border-primary bg-primary-light/60 px-4 py-3 text-sm text-primary-dark">
          Check your email for instructions to reset your password. The link is valid for 2 hours.
        </div>
      ) : null}
    </form>
  );
}
