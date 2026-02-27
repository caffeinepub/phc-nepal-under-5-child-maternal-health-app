import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import type { UserProfile, UserRole } from '../backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { User, Edit2, Save, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { nanosToMs, formatDate, msToNanos } from '../utils/pregnancyCalculations';

interface Props { profile: UserProfile | null; }

export default function ProfilePage({ profile }: Props) {
  const { t } = useLanguage();
  const { identity } = useInternetIdentity();
  const saveProfile = useSaveCallerUserProfile();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [country, setCountry] = useState('Nepal');
  const [role, setRole] = useState<UserRole | ''>('');
  const [expectedDueDate, setExpectedDueDate] = useState('');
  const [childDob, setChildDob] = useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setAge(profile.age.toString());
      setCountry(profile.country);
      setRole(profile.role);
      if (profile.expectedDueDate) {
        const d = new Date(nanosToMs(profile.expectedDueDate));
        setExpectedDueDate(d.toISOString().split('T')[0]);
      }
      if (profile.childDob) {
        const d = new Date(nanosToMs(profile.childDob));
        setChildDob(d.toISOString().split('T')[0]);
      }
    }
  }, [profile]);

  const showDueDate = role === 'pregnantWoman';
  const showChildDob = role === 'mother' || role === 'familyMember';

  const handleSave = async () => {
    if (!name.trim() || !age || !role) { toast.error(t.app.required); return; }
    const updated: UserProfile = {
      name: name.trim(),
      age: BigInt(parseInt(age, 10)),
      country,
      role: role as UserRole,
      expectedDueDate: showDueDate && expectedDueDate
        ? msToNanos(new Date(expectedDueDate).getTime()) : undefined,
      childDob: showChildDob && childDob
        ? msToNanos(new Date(childDob).getTime()) : undefined,
    };
    try {
      await saveProfile.mutateAsync(updated);
      toast.success(t.profile.profileSaved);
      setEditing(false);
    } catch {
      toast.error(t.app.error);
    }
  };

  const getRoleLabel = (r: UserRole) => {
    const map: Record<UserRole, string> = {
      pregnantWoman: t.profile.roles.pregnantWoman,
      mother: t.profile.roles.mother,
      familyMember: t.profile.roles.familyMember,
      healthWorker: t.profile.roles.healthWorker,
    };
    return map[r] || r;
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="rounded-2xl p-4 text-white" style={{ backgroundColor: 'oklch(0.28 0.1 145)' }}>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <User className="h-5 w-5" style={{ color: 'oklch(0.72 0.16 55)' }} />
          {t.profile.title}
        </h2>
        {identity && (
          <p className="text-xs mt-1 opacity-60 truncate">
            ID: {identity.getPrincipal().toString().slice(0, 20)}...
          </p>
        )}
      </div>

      {!profile ? (
        <Card className="shadow-card">
          <CardContent className="p-6 text-center text-muted-foreground text-sm">
            No profile found. Please complete your profile setup.
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-card">
          <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between">
            <CardTitle className="text-base" style={{ color: 'oklch(0.28 0.1 145)' }}>
              Profile Information
            </CardTitle>
            {!editing ? (
              <Button size="sm" variant="outline" onClick={() => setEditing(true)} className="gap-1 text-xs">
                <Edit2 className="h-3 w-3" />{t.profile.editProfile}
              </Button>
            ) : (
              <div className="flex gap-1">
                <Button size="sm" onClick={handleSave} disabled={saveProfile.isPending}
                  className="gap-1 text-xs text-white" style={{ backgroundColor: 'oklch(0.38 0.1 145)' }}>
                  {saveProfile.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <><Save className="h-3 w-3" />{t.app.save}</>}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditing(false)} className="gap-1 text-xs">
                  <X className="h-3 w-3" />{t.app.cancel}
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {editing ? (
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">{t.profile.name}</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">{t.profile.age}</Label>
                    <Input type="number" min="10" max="60" value={age} onChange={(e) => setAge(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs">{t.profile.country}</Label>
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
                  <Label className="text-xs">{t.profile.role}</Label>
                  <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
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
                    <Label className="text-xs">{t.profile.expectedDueDate}</Label>
                    <Input type="date" value={expectedDueDate} onChange={(e) => setExpectedDueDate(e.target.value)} className="mt-1" />
                  </div>
                )}
                {showChildDob && (
                  <div>
                    <Label className="text-xs">{t.profile.childDob}</Label>
                    <Input type="date" value={childDob} onChange={(e) => setChildDob(e.target.value)} className="mt-1" />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'oklch(0.94 0.03 145)' }}>
                  <div className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                    style={{ backgroundColor: 'oklch(0.38 0.1 145)' }}>
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold" style={{ color: 'oklch(0.28 0.1 145)' }}>{profile.name}</p>
                    <p className="text-xs text-muted-foreground">{profile.age.toString()} years · {profile.country}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-secondary">
                    <p className="text-xs text-muted-foreground">{t.profile.role}</p>
                    <Badge className="mt-1 text-xs" style={{ backgroundColor: 'oklch(0.94 0.03 145)', color: 'oklch(0.28 0.1 145)' }}>
                      {getRoleLabel(profile.role)}
                    </Badge>
                  </div>
                  <div className="p-3 rounded-xl bg-secondary">
                    <p className="text-xs text-muted-foreground">{t.profile.country}</p>
                    <p className="text-sm font-medium mt-1">{profile.country}</p>
                  </div>
                </div>
                {profile.expectedDueDate && (
                  <div className="p-3 rounded-xl bg-secondary">
                    <p className="text-xs text-muted-foreground">{t.profile.expectedDueDate}</p>
                    <p className="text-sm font-medium mt-1">{formatDate(nanosToMs(profile.expectedDueDate))}</p>
                  </div>
                )}
                {profile.childDob && (
                  <div className="p-3 rounded-xl bg-secondary">
                    <p className="text-xs text-muted-foreground">{t.profile.childDob}</p>
                    <p className="text-sm font-medium mt-1">{formatDate(nanosToMs(profile.childDob))}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
