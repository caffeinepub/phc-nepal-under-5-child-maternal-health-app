import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useGetImmunizations, useSaveImmunization } from '../hooks/useQueries';
import type { UserProfile } from '../backend';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, Clock, Syringe, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { nanosToMs, msToNanos, formatDate, getChildAgeFromDob } from '../utils/pregnancyCalculations';

interface Props { onBack: () => void; profile: UserProfile | null; }

export default function ImmunizationPage({ onBack, profile }: Props) {
  const { t } = useLanguage();
  const { data: records = [], isLoading } = useGetImmunizations();
  const saveImmunization = useSaveImmunization();
  const [editingVaccine, setEditingVaccine] = useState<string | null>(null);
  const [givenDate, setGivenDate] = useState('');

  const childDobMs = profile?.childDob ? nanosToMs(profile.childDob) : null;
  const childAge = childDobMs ? getChildAgeFromDob(childDobMs) : null;

  const getRecord = (vaccine: string) => records.find((r) => r.vaccine === vaccine);

  const getDueDate = (ageWeeks: number): Date | null => {
    if (!childDobMs) return null;
    return new Date(childDobMs + ageWeeks * 7 * 24 * 60 * 60 * 1000);
  };

  const isOverdue = (ageWeeks: number): boolean => {
    const due = getDueDate(ageWeeks);
    if (!due) return false;
    return due < new Date();
  };

  const handleSave = async (vaccine: string) => {
    try {
      await saveImmunization.mutateAsync({
        vaccine,
        date: givenDate ? msToNanos(new Date(givenDate).getTime()) : undefined,
        completed: true,
      });
      toast.success(t.immunization.vaccineSaved);
      setEditingVaccine(null);
      setGivenDate('');
    } catch {
      toast.error(t.app.error);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="rounded-2xl p-4 text-white" style={{ backgroundColor: 'oklch(0.28 0.1 145)' }}>
        <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/10 -ml-2 mb-2 gap-1">
          <ArrowLeft className="h-4 w-4" />{t.app.back}
        </Button>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Syringe className="h-5 w-5" style={{ color: 'oklch(0.72 0.16 55)' }} />{t.immunization.title}
        </h2>
        <p className="text-sm mt-1" style={{ color: 'oklch(0.88 0.03 85)' }}>{t.immunization.subtitle}</p>
        {childAge && (
          <p className="text-xs mt-1 text-white/70">
            Child age: {childAge.years > 0 ? `${childAge.years}y ` : ''}{childAge.months}m
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin" /></div>
      ) : (
        <div className="space-y-2">
          {t.immunization.schedule.map((item) => {
            const record = getRecord(item.vaccine);
            const due = getDueDate(item.ageWeeks);
            const overdue = !record?.completed && isOverdue(item.ageWeeks);
            const isEditing = editingVaccine === item.vaccine;

            return (
              <Card key={item.vaccine} className={`shadow-card ${overdue ? 'border-red-300' : ''}`}>
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 min-w-0">
                      {record?.completed
                        ? <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        : overdue
                        ? <Clock className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        : <Clock className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />}
                      <div className="min-w-0">
                        <p className="font-semibold text-sm" style={{ color: 'oklch(0.28 0.1 145)' }}>{item.vaccine}</p>
                        <p className="text-xs text-muted-foreground">{item.timing} · {item.disease}</p>
                        {due && !record?.completed && (
                          <p className={`text-xs mt-0.5 ${overdue ? 'text-red-600 font-medium' : 'text-muted-foreground'}`}>
                            Due: {formatDate(due.getTime())}
                          </p>
                        )}
                        {record?.date && (
                          <p className="text-xs text-green-600 mt-0.5">✓ Given: {formatDate(nanosToMs(record.date))}</p>
                        )}
                      </div>
                    </div>
                    <Badge className="text-xs flex-shrink-0" style={
                      record?.completed ? { backgroundColor: '#dcfce7', color: '#166534' }
                      : overdue ? { backgroundColor: '#fee2e2', color: '#991b1b' }
                      : { backgroundColor: '#ffedd5', color: '#9a3412' }
                    }>
                      {record?.completed ? t.app.completed : overdue ? t.app.overdue : t.app.pending}
                    </Badge>
                  </div>
                  {!record?.completed && (
                    isEditing ? (
                      <div className="mt-3 space-y-2 border-t pt-3">
                        <div>
                          <Label className="text-xs">{t.immunization.givenDate}</Label>
                          <Input type="date" value={givenDate} onChange={(e) => setGivenDate(e.target.value)} className="mt-1 h-8 text-sm" />
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleSave(item.vaccine)} disabled={saveImmunization.isPending}
                            className="text-white text-xs" style={{ backgroundColor: 'oklch(0.38 0.1 145)' }}>
                            {saveImmunization.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : t.immunization.markGiven}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingVaccine(null)} className="text-xs">{t.app.cancel}</Button>
                        </div>
                      </div>
                    ) : (
                      <Button size="sm" variant="outline" className="mt-2 text-xs h-7"
                        onClick={() => { setEditingVaccine(item.vaccine); setGivenDate(''); }}>
                        {t.immunization.logVaccine}
                      </Button>
                    )
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
