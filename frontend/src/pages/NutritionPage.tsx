import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, Droplets } from 'lucide-react';

interface Props { onBack: () => void; }

export default function NutritionPage({ onBack }: Props) {
  const { t } = useLanguage();
  const n = t.nutrition;

  const nutritionSections = [
    { key: 'preconception', label: n.tabs.preconception, data: n.preconception },
    { key: 'firstTrimester', label: n.tabs.firstTrimester, data: n.firstTrimester },
    { key: 'secondTrimester', label: n.tabs.secondTrimester, data: n.secondTrimester },
    { key: 'thirdTrimester', label: n.tabs.thirdTrimester, data: n.thirdTrimester },
    { key: 'breastfeeding', label: n.tabs.breastfeeding, data: n.breastfeeding },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="rounded-2xl p-4 text-white" style={{ backgroundColor: 'oklch(0.28 0.1 145)' }}>
        <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/10 -ml-2 mb-2 gap-1">
          <ArrowLeft className="h-4 w-4" />{t.app.back}
        </Button>
        <h2 className="text-xl font-bold">{n.title}</h2>
        <p className="text-sm mt-1" style={{ color: 'oklch(0.88 0.03 85)' }}>{n.subtitle}</p>
      </div>

      <Tabs defaultValue="preconception">
        <TabsList className="flex flex-wrap h-auto gap-1 p-1">
          {nutritionSections.map((s) => (
            <TabsTrigger key={s.key} value={s.key} className="text-xs px-2 py-1">{s.label}</TabsTrigger>
          ))}
          <TabsTrigger value="hygiene" className="text-xs px-2 py-1">{n.tabs.hygiene}</TabsTrigger>
        </TabsList>

        {nutritionSections.map((s) => (
          <TabsContent key={s.key} value={s.key} className="mt-3">
            <Card className="shadow-card">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-base" style={{ color: 'oklch(0.28 0.1 145)' }}>{s.data.title}</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="text-sm text-muted-foreground mb-3">{s.data.content}</p>
                <ul className="space-y-2">
                  {s.data.foods.map((food, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: 'oklch(0.38 0.1 145)' }} />
                      <span>{food}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        ))}

        <TabsContent value="hygiene" className="mt-3 space-y-3">
          {n.hygiene.tips.map((tip, i) => (
            <Card key={i} className="shadow-card">
              <CardContent className="p-4 flex gap-3">
                <Droplets className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: 'oklch(0.72 0.16 55)' }} />
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'oklch(0.28 0.1 145)' }}>{tip.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{tip.content}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
