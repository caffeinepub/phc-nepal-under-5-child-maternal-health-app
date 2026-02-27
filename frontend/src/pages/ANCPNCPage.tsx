import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useGetANCVisits, useSaveANCVisit } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { msToNanos, nanosToMs, formatDate } from '../utils/pregnancyCalculations';

interface Props { onBack: () => void; }

export default function ANCPNCPage({ onBack }: Props) {
  const { t } = useLanguage();
  const { data: visits = [], isLoading } = useGetANCVisits();
  const saveVisit = useSaveANCVisit();
  const [editingVisit, setEditingVisit] = useState<number | null>(null);
  const [visitDate, setVisitDate] = useState('');
  const [visitNotes, setVisitNotes] = useState('');

  const getVisit = (num: number) => visits.find((v) => Number(v.visitNumber) === num);

  const handleSave = async (visitNumber: number) => {
    try {
      await saveVisit.mutateAsync({
        visitNumber: BigInt(visitNumber),
        date: visitDate ? msToNanos(new Date(visitDate).getTime()) : undefined,
        notes: visitNotes || undefined,
        completed: true,
      });
      toast.success(t.ancPnc.visitSaved);
      setEditingVisit(null);
      setVisitDate('');
      setVisitNotes('');
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
        <h2 className="text-xl font-bold">{t.ancPnc.title}</h2>
        <p className="text-sm mt-1" style={{ color: 'oklch(0.88 0.03 85)' }}>{t.ancPnc.subtitle}</p>
      </div>

      <Tabs defaultValue="anc">
        <TabsList className="w-full">
          <TabsTrigger value="anc" className="flex-1">{t.ancPnc.ancTitle}</TabsTrigger>
          <TabsTrigger value="pnc" className="flex-1">{t.ancPnc.pncTitle}</TabsTrigger>
        </TabsList>

        <TabsContent value="anc" className="space-y-2 mt-3">
          <p className="text-xs text-muted-foreground px-1">{t.ancPnc.ancSubtitle}</p>
          {isLoading ? (
            <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin" /></div>
          ) : (
            t.ancPnc.ancSchedule.map((item) => {
              const logged = getVisit(item.visit);
              const isEditing = editingVisit === item.visit;
              return (
                <Card key={item.visit} className="shadow-card">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 min-w-0">
                        {logged?.completed
                          ? <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          : <Clock className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />}
                        <div className="min-w-0">
                          <p className="font-semibold text-sm" style={{ color: 'oklch(0.28 0.1 145)' }}>
                            {t.ancPnc.visitNumber} {item.visit}
                          </p>
                          <p className="text-xs text-muted-foreground">{item.timing}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.services}</p>
                          {logged?.date && (
                            <p className="text-xs text-green-600 mt-1">✓ {formatDate(nanosToMs(logged.date))}</p>
                          )}
                        </div>
                      </div>
                      <Badge className="text-xs flex-shrink-0" style={logged?.completed
                        ? { backgroundColor: '#dcfce7', color: '#166534' }
                        : { backgroundColor: '#ffedd5', color: '#9a3412' }}>
                        {logged?.completed ? t.app.completed : t.app.pending}
                      </Badge>
                    </div>
                    {!logged?.completed && (
                      isEditing ? (
                        <div className="mt-3 space-y-2 border-t pt-3">
                          <div>
                            <Label className="text-xs">{t.ancPnc.visitDate}</Label>
                            <Input type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} className="mt-1 h-8 text-sm" />
                          </div>
                          <div>
                            <Label className="text-xs">{t.ancPnc.visitNotes}</Label>
                            <Input value={visitNotes} onChange={(e) => setVisitNotes(e.target.value)} className="mt-1 h-8 text-sm" placeholder="Optional notes" />
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleSave(item.visit)} disabled={saveVisit.isPending}
                              className="text-white text-xs" style={{ backgroundColor: 'oklch(0.38 0.1 145)' }}>
                              {saveVisit.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : t.ancPnc.markComplete}
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingVisit(null)} className="text-xs">{t.app.cancel}</Button>
                          </div>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline" className="mt-2 text-xs h-7"
                          onClick={() => { setEditingVisit(item.visit); setVisitDate(''); setVisitNotes(''); }}>
                          {t.ancPnc.logVisit}
                        </Button>
                      )
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="pnc" className="space-y-3 mt-3">
          <Card className="shadow-card">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm" style={{ color: 'oklch(0.28 0.1 145)' }}>{t.ancPnc.pncMother}</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <ul className="space-y-2">
                {t.ancPnc.pncSchedule.mother.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm p-2 rounded-lg bg-secondary">
                    <Clock className="h-4 w-4 flex-shrink-0" style={{ color: 'oklch(0.72 0.16 55)' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm" style={{ color: 'oklch(0.28 0.1 145)' }}>{t.ancPnc.pncNewborn}</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <ul className="space-y-2">
                {t.ancPnc.pncSchedule.newborn.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm p-2 rounded-lg bg-secondary">
                    <Clock className="h-4 w-4 flex-shrink-0" style={{ color: 'oklch(0.72 0.16 55)' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
