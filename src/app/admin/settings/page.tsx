import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-10 animate-fade-in-up">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-primary-dark">System Settings</h1>
        <p className="text-sm text-neutral-soft">
          Configure platform defaults, security controls, and communication preferences.
        </p>
      </header>

      <div className="card p-8 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-primary-dark">Brand basics</h2>
          <p className="text-sm text-neutral-soft">
            Update default contact information and support channels members see.
          </p>
        </div>
        <form className="grid gap-6 md:grid-cols-2">
          <div>
            <Label htmlFor="supportEmail">Support email</Label>
            <Input id="supportEmail" name="supportEmail" defaultValue="support@natxportal.com" />
          </div>
          <div>
            <Label htmlFor="phone">Support line</Label>
            <Input id="phone" name="phone" defaultValue="+1 (512) 555-0123" />
          </div>
          <div>
            <Label htmlFor="address">Mailing address</Label>
            <Input id="address" name="address" defaultValue="401 Congress Ave, Austin, TX" />
          </div>
          <div>
            <Label htmlFor="timezone">Default timezone</Label>
            <select
              id="timezone"
              name="timezone"
              className="block w-full rounded-xl border-2 border-neutral-border bg-white px-4 py-3 text-base text-neutral focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all"
            >
              <option value="Central">Central (CDT)</option>
              <option value="Eastern">Eastern (EDT)</option>
              <option value="Pacific">Pacific (PDT)</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <Button type="button">Save configuration</Button>
          </div>
        </form>
      </div>

      <div className="card p-8 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-primary-dark">Security</h2>
          <p className="text-sm text-neutral-soft">
            Enforce multi-factor authentication and password policies across admins.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <label className="flex items-center justify-between rounded-2xl border border-neutral-border px-4 py-3 text-sm text-neutral">
            <span>Require MFA for all admins</span>
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-2 border-neutral-border text-primary"
              defaultChecked
            />
          </label>
          <label className="flex items-center justify-between rounded-2xl border border-neutral-border px-4 py-3 text-sm text-neutral">
            <span>Notify admin team of new member signups</span>
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-2 border-neutral-border text-primary"
              defaultChecked
            />
          </label>
        </div>
        <Button type="button" variant="outline" className="w-full sm:w-auto">
          Update security settings
        </Button>
      </div>
    </div>
  );
}
