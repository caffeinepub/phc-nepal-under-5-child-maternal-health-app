import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import type { Translations } from '../i18n/config';

interface Props { onBack: () => void; }

type AgeBand = keyof Translations['milestones']['data'];
type Domain = 'physical' | 'cognitive' | 'language' | 'social';

export default function MilestonesPage({ onBack }: Props) {
  const { t } = useLanguage();
  const ms = t.milestones;
  const ageBands = Object.keys(ms.ageBands) as AgeBand[];

  const domainColors: Record<Domain, { bg: string; text: string }> = {
    physical: { bg: '#dcfce7', text: '#166534' },
    cognitive: { bg: '#dbeafe', text: '#1e40af' },
    language: { bg: '#fce7f3', text: '#9d174d' },
    social: { bg: '#fef9c3', text: '#713f12' },
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="rounded-2xl p-4 text-white" style={{ backgroundColor: 'oklch(0.28 0.1 145)' }}>
        <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/10 -ml-2 mb-2 gap-1">
          <ArrowLeft className="h-4 w-4" />{t.app.back}
        </Button>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Activity className="h-5 w-5" style={{ color: 'oklch(0.72 0.16 55)' }} />
          {ms.title}
        </h2>
        <p className="text-sm mt-1" style={{ color: 'oklch(0.88 0.03 85)' }}>{ms.subtitle}</p>
      </div>

      <Tabs defaultValue="milestones">
        <TabsList className="w-full">
          <TabsTrigger value="milestones" className="flex-1">Milestones</TabsTrigger>
          <TabsTrigger value="problems" className="flex-1">Common Problems</TabsTrigger>
        </TabsList>

        <TabsContent value="milestones" className="mt-3">
          <Accordion type="single" collapsible className="space-y-2">
            {ageBands.map((band) => {
              const data = ms.data[band];
              const label = ms.ageBands[band];
              return (
                <AccordionItem key={band} value={band} className="bg-card rounded-xl border shadow-card overflow-hidden">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <span className="font-bold text-sm" style={{ color: 'oklch(0.28 0.1 145)' }}>{label}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-3">
                      {(['physical', 'cognitive', 'language', 'social'] as Domain[]).map((domain) => {
                        const items = data[domain];
                        const colors = domainColors[domain];
                        return (
                          <div key={domain} className="rounded-xl p-3" style={{ backgroundColor: colors.bg }}>
                            <p className="font-semibold text-xs mb-2 uppercase tracking-wide" style={{ color: colors.text }}>
                              {ms.domains[domain]}
                            </p>
                            <ul className="space-y-1">
                              {items.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs">
                                  <CheckCircle className="h-3 w-3 flex-shrink-0 mt-0.5" style={{ color: colors.text }} />
                                  <span style={{ color: colors.text }}>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                      <div className="rounded-xl p-3 bg-secondary">
                        <p className="text-xs font-semibold" style={{ color: 'oklch(0.28 0.1 145)' }}>💡 How to support:</p>
                        <p className="text-xs text-muted-foreground mt-1">{data.support}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </TabsContent>

        <TabsContent value="problems" className="mt-3 space-y-3">
          <Card className="shadow-card">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-base" style={{ color: 'oklch(0.28 0.1 145)' }}>
                {ms.commonProblems.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-3">
              {ms.commonProblems.problems.map((problem, i) => (
                <div key={i} className="rounded-xl border border-border overflow-hidden">
                  <div className="px-3 py-2" style={{ backgroundColor: 'oklch(0.94 0.03 145)' }}>
                    <p className="font-bold text-sm" style={{ color: 'oklch(0.28 0.1 145)' }}>{problem.name}</p>
                  </div>
                  <div className="px-3 py-2 space-y-2">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Management</p>
                      <p className="text-xs mt-0.5">{problem.management}</p>
                    </div>
                    <div className="flex items-start gap-2 bg-red-50 rounded-lg p-2">
                      <AlertTriangle className="h-3 w-3 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-red-700">Danger Signs:</p>
                        <p className="text-xs text-red-600">{problem.dangerSigns}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
