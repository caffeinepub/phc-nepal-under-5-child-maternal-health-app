import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Utensils, CheckCircle, Heart } from 'lucide-react';

interface Props { onBack: () => void; }

function getMethodColor(type: string): { bg: string; text: string } {
  const normalized = type.toLowerCase();
  if (normalized.includes('natural') || normalized.includes('प्राकृतिक')) {
    return { bg: '#dcfce7', text: '#166534' };
  }
  if (normalized.includes('barrier') || normalized.includes('बाधा')) {
    return { bg: '#dbeafe', text: '#1e40af' };
  }
  if (normalized.includes('hormonal') || normalized.includes('हार्मोनल')) {
    return { bg: '#fce7f3', text: '#9d174d' };
  }
  if (normalized.includes('long') || normalized.includes('दीर्घ')) {
    return { bg: '#e0e7ff', text: '#3730a3' };
  }
  if (normalized.includes('permanent') || normalized.includes('स्थायी')) {
    return { bg: '#fee2e2', text: '#991b1b' };
  }
  return { bg: '#f3f4f6', text: '#374151' };
}

export default function SupplementaryFeedingPage({ onBack }: Props) {
  const { t } = useLanguage();
  const sf = t.supplementaryFeeding;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="rounded-2xl p-4 text-white" style={{ backgroundColor: 'oklch(0.28 0.1 145)' }}>
        <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/10 -ml-2 mb-2 gap-1">
          <ArrowLeft className="h-4 w-4" />{t.app.back}
        </Button>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Utensils className="h-5 w-5" style={{ color: 'oklch(0.72 0.16 55)' }} />
          {sf.title}
        </h2>
        <p className="text-sm mt-1" style={{ color: 'oklch(0.88 0.03 85)' }}>{sf.subtitle}</p>
      </div>

      <Tabs defaultValue="feeding">
        <TabsList className="w-full">
          <TabsTrigger value="feeding" className="flex-1">{sf.tabs.feeding}</TabsTrigger>
          <TabsTrigger value="fp" className="flex-1">{sf.tabs.familyPlanning}</TabsTrigger>
        </TabsList>

        <TabsContent value="feeding" className="mt-3 space-y-3">
          <p className="text-sm text-muted-foreground px-1">{sf.feeding.intro}</p>
          {sf.feeding.ageBands.map((band, i) => (
            <Card key={i} className="shadow-card">
              <CardHeader className="pb-2 pt-3 px-4" style={{ backgroundColor: 'oklch(0.94 0.03 145)' }}>
                <CardTitle className="text-sm font-bold" style={{ color: 'oklch(0.28 0.1 145)' }}>
                  {band.age}
                </CardTitle>
                <div className="flex flex-wrap gap-3 mt-1">
                  <span className="text-xs text-muted-foreground">📐 {band.texture}</span>
                  <span className="text-xs text-muted-foreground">🕐 {band.frequency}</span>
                  <span className="text-xs text-muted-foreground">🥄 {band.amount}</span>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-3 pt-3">
                <p className="text-xs font-semibold mb-2" style={{ color: 'oklch(0.28 0.1 145)' }}>
                  Recommended Foods:
                </p>
                <ul className="space-y-1">
                  {band.foods.map((food, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs">
                      <CheckCircle className="h-3 w-3 flex-shrink-0" style={{ color: 'oklch(0.38 0.1 145)' }} />
                      {food}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="fp" className="mt-3 space-y-3">
          <p className="text-sm text-muted-foreground px-1">{sf.familyPlanning.intro}</p>
          {sf.familyPlanning.methods.map((method, i) => {
            const colors = getMethodColor(method.type);
            return (
              <Card key={i} className="shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-bold text-sm" style={{ color: 'oklch(0.28 0.1 145)' }}>
                      {method.name}
                    </p>
                    <Badge
                      className="text-xs flex-shrink-0"
                      style={{ backgroundColor: colors.bg, color: colors.text }}
                    >
                      {method.type}
                    </Badge>
                  </div>
                  <div className="flex gap-4 mb-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="text-xs font-medium">{method.duration}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Effectiveness</p>
                      <p className="text-xs font-medium text-green-700">{method.effectiveness}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground bg-secondary rounded-lg p-2">{method.note}</p>
                </CardContent>
              </Card>
            );
          })}

          <Card className="shadow-card border-blue-200 bg-blue-50">
            <CardContent className="p-3 flex gap-2">
              <Heart className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                Consult your healthcare provider at your 6-week postnatal visit to choose the best
                family planning method for you.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
