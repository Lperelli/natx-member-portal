'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { updateProfile } from '@/lib/server-actions/profile-actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type ProfileFormProps = {
  initialData: {
    firstName: string;
    lastName: string;
    title?: string | null;
    company?: string | null;
    bio?: string | null;
    linkedinUrl?: string | null;
    region?: string | null;
    industry?: string | null;
  };
};

type FormState = {
  success: boolean;
  errors?: Record<string, string[]>;
};

const initialState: FormState = {
  success: false
};

async function submitProfileAction(_prevState: FormState, formData: FormData) {
  return updateProfile(formData);
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" isLoading={pending} className="w-full sm:w-auto">
      Save changes
    </Button>
  );
}

function FieldError({ message }: { message?: string[] }) {
  if (!message?.length) return null;
  return <p className="mt-1 text-xs font-medium text-danger">{message[0]}</p>;
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [state, formAction] = useFormState<FormState, FormData>(submitProfileAction, initialState);

  return (
    <form className="space-y-8" action={formAction}>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="firstName">First name</Label>
          <Input id="firstName" name="firstName" defaultValue={initialData.firstName} />
          <FieldError message={state.errors?.firstName} />
        </div>
        <div>
          <Label htmlFor="lastName">Last name</Label>
          <Input id="lastName" name="lastName" defaultValue={initialData.lastName} />
          <FieldError message={state.errors?.lastName} />
        </div>
        <div>
          <Label htmlFor="title">Role / title</Label>
          <Input id="title" name="title" defaultValue={initialData.title ?? ''} />
        </div>
        <div>
          <Label htmlFor="company">Company</Label>
          <Input id="company" name="company" defaultValue={initialData.company ?? ''} />
        </div>
      </div>

      <div>
        <Label htmlFor="bio">Short bio</Label>
        <textarea
          id="bio"
          name="bio"
          defaultValue={initialData.bio ?? ''}
          className="mt-1 block w-full rounded-xl border-2 border-neutral-border bg-white px-4 py-3 text-base text-neutral placeholder:text-[#94A3B8] focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all"
          rows={4}
        />
        <FieldError message={state.errors?.bio} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
          <Input id="linkedinUrl" name="linkedinUrl" defaultValue={initialData.linkedinUrl ?? ''} />
          <FieldError message={state.errors?.linkedinUrl} />
        </div>
        <div>
          <Label htmlFor="region">Region</Label>
          <select
            id="region"
            name="region"
            defaultValue={initialData.region ?? ''}
            className="block w-full rounded-xl border-2 border-neutral-border bg-white px-4 py-3 text-base text-neutral focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all"
          >
            <option value="">Select region</option>
            <option value="NORTH">North</option>
            <option value="SOUTH">South</option>
            <option value="EAST">East</option>
            <option value="WEST">West</option>
            <option value="CENTRAL">Central</option>
          </select>
        </div>
        <div>
          <Label htmlFor="industry">Industry</Label>
          <select
            id="industry"
            name="industry"
            defaultValue={initialData.industry ?? ''}
            className="block w-full rounded-xl border-2 border-neutral-border bg-white px-4 py-3 text-base text-neutral focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all"
          >
            <option value="">Select industry</option>
            <option value="SAAS">SaaS</option>
            <option value="FINTECH">FinTech</option>
            <option value="HEALTHCARE">Healthcare</option>
            <option value="ECOMMERCE">E-commerce</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </div>

      <SubmitButton />
      {state.success ? (
        <div className="rounded-xl border border-primary bg-primary-light/50 px-4 py-3 text-sm text-primary-dark">
          Profile updated successfully
        </div>
      ) : null}
    </form>
  );
}
