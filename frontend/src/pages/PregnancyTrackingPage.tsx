import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useGetPregnantEvents, useSavePregnantEvent, useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Calendar, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getGestationalAgeFromEDD, getTrimester, nanosToMs, msToNanos, formatDate } from '../utils/pregnancyCalculations';

interface Props { onBack: () => void; }

export default function PregnancyTrackingPage({ onBack }: Props) {
  const { t } = useLanguage();
  const { data: profile } = useGetCallerUserProfile();
  const { data: events = [], isLoading } = useGetPregnantEvents();
  const saveEvent = useSavePregnantEvent();

  const [showForm, setShowForm] = useState(false);
  const [eventType, setEventType] = useState('');
  const [eventDate, setEventDate] = useState('');

  const eddMs = profile?.expectedDueDate ? nanosToMs(profile.expectedDueDate) : null;
  const gestAge = eddMs ? getGestationalAgeFromEDD(eddMs) : null;
  const trimester = gestAge ? getTrimester(gestAge.weeks) : null;

  const handleSave = async () => {
    if (!eventType || !eventDate) return;
    try {
      await saveEvent.mutateAsync({
        eventType,
        date: msToNanos(new Date(eventDate).getTime()),
      });
      toast.success(t.pregnancy.eventSaved);
      setShowForm(false);
      setEventType('');
      setEventDate('');
    } catch {
      toast.error(t.app.error);
    }
  };

  const trimesterLabel = trimester === 1 ? t.pregnancy.trimesters.first
    : trimester === 2 ? t.pregnancy.trimesters.second
    : trimester === 3 ? t.pregnancy.trimesters.third : null;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="rounded-2xl p-4 text-white" style={{ backgroundColor: 'oklch(0.28 0.1 145)' }}>
        <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/10 -ml-2 mb-2 gap-1">
          <ArrowLeft className="h-4 w-4" />{t.app.back}
        </Button>
        <h2 className="text-xl font-bold">{t.pregnancy.title}</h2>
        <p className="text-sm mt-1" style={{ color: 'oklch(0.88 0.03 85)' }}>{t.pregnancy.subtitle}</p>
      </div>

      {gestAge && (
        <Card className="shadow-card">
          <CardContent className="p-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl p-3" style={{ backgroundColor: 'oklch(0.94 0.03 145)' }}>
              <p className="text-xs text-muted-foreground">{t.pregnancy.gestationalAge}</p>
              <p className="font-bold text-lg" style={{ color: 'oklch(0.28 0.1 145)' }}>{gestAge.weeks}w {gestAge.days}d</p>
            </div>
            <div className="rounded-xl p-3" style={{ backgroundColor: 'oklch(0.94 0.03 145)' }}>
              <p className="text-xs text-muted-foreground">{t.pregnancy.trimester}</p>
              <p className="font-bold text-lg" style={{ color: 'oklch(0.28 0.1 145)' }}>T{trimester}</p>
            </div>
            <div className="rounded-xl p-3" style={{ backgroundColor: 'oklch(0.94 0.03 145)' }}>
              <p className="text-xs text-muted-foreground">{t.pregnancy.estimatedDueDate}</p>
              <p className="font-bold text-sm" style={{ color: 'oklch(0.28 0.1 145)' }}>
                {eddMs ? formatDate(eddMs) : '-'}
              </p>
            </div>
          </CardContent>
          {trimesterLabel && (
            <div className="px-4 pb-4">
              <Badge className="text-xs" style={{ backgroundColor: 'oklch(0.72 0.16 55)', color: 'oklch(0.15 0.04 55)' }}>
                {trimesterLabel}
              </Badge>
            </div>
          )}
        </Card>
      )}

      <Card className="shadow-card">
        <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between">
          <CardTitle className="text-base" style={{ color: 'oklch(0.28 0.1 145)' }}>
            <Calendar className="h-4 w-4 inline mr-2" style={{ color: 'oklch(0.72 0.16 55)' }} />
            Events
          </CardTitle>
          <Button size="sm" onClick={() => setShowForm(!showForm)}
            className="gap-1 text-white" style={{ backgroundColor: 'oklch(0.38 0.1 145)' }}>
            <Plus className="h-3 w-3" />{t.app.addNew}
          </Button>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {showForm && (
            <div className="bg-secondary rounded-xl p-3 mb-4 space-y-3">
              <div>
                <Label>{t.pregnancy.eventType}</Label>
                <Select value={eventType} onValueChange={setEventType}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder={t.pregnancy.eventType} /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(t.pregnancy.eventTypes).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t.pregnancy.eventDate}</Label>
                <Input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="mt-1" />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave} disabled={saveEvent.isPending}
                  className="text-white" style={{ backgroundColor: 'oklch(0.38 0.1 145)' }}>
                  {saveEvent.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : t.app.save}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>{t.app.cancel}</Button>
              </div>
            </div>
          )}
          {isLoading ? (
            <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin" /></div>
          ) : events.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">{t.pregnancy.noEvents}</p>
          ) : (
            <ul className="space-y-2">
              {[...events].sort((a, b) => Number(b.date - a.date)).map((ev, i) => (
                <li key={i} className="flex items-center justify-between p-2 rounded-lg bg-secondary">
                  <span className="text-sm font-medium">{(t.pregnancy.eventTypes as Record<string, string>)[ev.eventType] || ev.eventType}</span>
                  <span className="text-xs text-muted-foreground">{formatDate(nanosToMs(ev.date))}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
