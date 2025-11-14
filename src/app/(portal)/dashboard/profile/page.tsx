import { getCurrentUser } from '@/lib/current-user';
import { ProfileForm } from '@/components/profile/profile-form';
import { UserAvatar } from '@/components/user/user-avatar';

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="space-y-10 animate-fade-in-up">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-primary-dark">Profile Settings</h1>
          <p className="text-sm text-neutral-soft">
            Refine how you show up across the NATX community and tailor your executive presence.
          </p>
        </div>
        <UserAvatar
          name={`${user.firstName} ${user.lastName}`}
          src={user.avatarUrl ?? undefined}
          status="online"
          size={72}
        />
      </header>

      <div className="card p-8">
        <ProfileForm initialData={user} />
      </div>
    </div>
  );
}
