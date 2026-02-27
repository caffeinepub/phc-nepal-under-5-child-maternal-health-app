import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import type { UserProfile, UserRole } from '../backend';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface ProfileSetupModalProps {
  open: boolean;
  onComplete: () => void;
}

export default function ProfileSetupModal({ open, onComplete }: ProfileSetupModalProps) {
  const { t } = useLanguage();
  const saveProfile = useSaveCallerUserProfile();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [country, setCountry] = useState('Nepal');
  const [role, setRole] = useState<UserRole | ''>('');
  const [expectedDueDate, setExpectedDueDate] = useState('');
  const [childDob, setChildDob] = useState('');
  const [error, setError] = useState('');

  const showDueDate = role === 'pregnantWoman';
  const showChildDob = role === 'mother' || role === 'familyMember';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !age || !role) {
      setError(t.app.required);
      return;
    }
    const profile: UserProfile = {
      name: name.trim(),
      age: BigInt(parseInt(age, 10)),
      country,
      role: role as UserRole,
      expectedDueDate:
        showDueDate && expectedDueDate
          ? BigInt(new Date(expectedDueDate).getTime()) * BigInt(1_000_000)
          : undefined,
      childDob:
        showChildDob && childDob
          ? BigInt(new Date(childDob).getTime()) * BigInt(1_000_000)
          : undefined,
    };
    try {
      await saveProfile.mutateAsync(profile);
      onComplete();
    } catch {
      setError(t.app.error);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-md mx-auto"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex justify-center mb-2">
            <img
              src="/assets/generated/phc-nepal-logo.dim_256x256.png"
              alt="PHC Nepal"
              className="h-14 w-14 rounded-full object-cover border-2"
              style={{ borderColor: 'oklch(0.72 0.16 55)' }}
            />
          </div>
          <DialogTitle className="text-center" style={{ color: 'oklch(0.28 0.1 145)' }}>
            {t.profile.setup}
          </DialogTitle>
          <DialogDescription className="text-center text-sm">
            {t.profile.setupSubtitle}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="pname">{t.profile.name} *</Label>
            <Input id="pname" value={name} onChange={(e) => setName(e.target.value)}
              placeholder={t.profile.name} className="mt-1" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="page">{t.profile.age} *</Label>
              <Input id="page" type="number" min="10" max="60" value={age}
                onChange={(e) => setAge(e.target.value)} placeholder="25" className="mt-1" required />
            </div>
            <div>
              <Label>{t.profile.country}</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nepal">{t.profile.countries.nepal}</SelectItem>
                  <SelectItem value="India">{t.profile.countries.india}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>{t.profile.role} *</Label>
            <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
              <SelectTrigger className="mt-1"><SelectValue placeholder={t.profile.role} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pregnantWoman">{t.profile.roles.pregnantWoman}</SelectItem>
                <SelectItem value="mother">{t.profile.roles.mother}</SelectItem>
                <SelectItem value="familyMember">{t.profile.roles.familyMember}</SelectItem>
                <SelectItem value="healthWorker">{t.profile.roles.healthWorker}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {showDueDate && (
            <div>
              <Label htmlFor="pedd">{t.profile.expectedDueDate}</Label>
              <Input id="pedd" type="date" value={expectedDueDate}
                onChange={(e) => setExpectedDueDate(e.target.value)} className="mt-1" />
            </div>
          )}
          {showChildDob && (
            <div>
              <Label htmlFor="pcdob">{t.profile.childDob}</Label>
              <Input id="pcdob" type="date" value={childDob}
                onChange={(e) => setChildDob(e.target.value)} className="mt-1" />
            </div>
          )}
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" className="w-full text-white font-semibold"
            style={{ backgroundColor: 'oklch(0.38 0.1 145)' }}
            disabled={saveProfile.isPending}>
            {saveProfile.isPending
              ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />{t.app.loading}</>
              : t.profile.saveProfile}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
