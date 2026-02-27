import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Baby, Heart, Calendar, AlertTriangle, Utensils, TrendingUp, Syringe, Activity, BookOpen, Shield } from 'lucide-react';

type ModulePage = 'babyPlanning' | 'pregnancy' | 'ancPnc' | 'dangerSigns' | 'nutrition'
  | 'newbornCare' | 'growth' | 'immunization' | 'milestones' | 'supplementaryFeeding';

interface HealthModulesPageProps {
  onNavigate: (page: ModulePage) => void;
}

export default function HealthModulesPage({ onNavigate }: HealthModulesPageProps) {
  const { t } = useLanguage();

  const modules: { id: ModulePage; icon: React.ReactNode; title: string; desc: string; bgColor: string; textColor: string }[] = [
    { id: 'babyPlanning', icon: <Baby className="h-6 w-6" />, title: t.nav.babyPlanning, desc: t.babyPlanning.subtitle, bgColor: '#dcfce7', textColor: '#166534' },
    { id: 'pregnancy', icon: <Heart className="h-6 w-6" />, title: t.nav.pregnancy, desc: t.pregnancy.subtitle, bgColor: '#fce7f3', textColor: '#9d174d' },
    { id: 'ancPnc', icon: <Calendar className="h-6 w-6" />, title: t.nav.ancPnc, desc: t.ancPnc.subtitle, bgColor: '#dbeafe', textColor: '#1e40af' },
    { id: 'dangerSigns', icon: <AlertTriangle className="h-6 w-6" />, title: t.nav.dangerSigns, desc: t.dangerSigns.subtitle, bgColor: '#fee2e2', textColor: '#991b1b' },
    { id: 'nutrition', icon: <Utensils className="h-6 w-6" />, title: t.nav.nutrition, desc: t.nutrition.subtitle, bgColor: '#ffedd5', textColor: '#9a3412' },
    { id: 'newbornCare', icon: <Baby className="h-6 w-6" />, title: t.nav.newbornCare, desc: t.newbornCare.subtitle, bgColor: '#f3e8ff', textColor: '#6b21a8' },
    { id: 'growth', icon: <TrendingUp className="h-6 w-6" />, title: t.nav.growth, desc: t.growth.subtitle, bgColor: '#ccfbf1', textColor: '#134e4a' },
    { id: 'immunization', icon: <Syringe className="h-6 w-6" />, title: t.nav.immunization, desc: t.immunization.subtitle, bgColor: '#e0e7ff', textColor: '#3730a3' },
    { id: 'milestones', icon: <Activity className="h-6 w-6" />, title: t.nav.milestones, desc: t.milestones.subtitle, bgColor: '#fef9c3', textColor: '#713f12' },
    { id: 'supplementaryFeeding', icon: <BookOpen className="h-6 w-6" />, title: t.nav.feeding, desc: t.supplementaryFeeding.subtitle, bgColor: '#ecfccb', textColor: '#365314' },
  ];

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="rounded-2xl p-4 text-white mb-2" style={{ backgroundColor: 'oklch(0.28 0.1 145)' }}>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Shield className="h-5 w-5" style={{ color: 'oklch(0.72 0.16 55)' }} />
          {t.nav.modules}
        </h2>
        <p className="text-sm mt-1" style={{ color: 'oklch(0.88 0.03 85)' }}>{t.app.tagline}</p>
      </div>
      {modules.map((mod) => (
        <Card key={mod.id} className="shadow-card hover:shadow-card-hover transition-all cursor-pointer active:scale-[0.99]"
          onClick={() => onNavigate(mod.id)}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl flex-shrink-0" style={{ backgroundColor: mod.bgColor, color: mod.textColor }}>
              {mod.icon}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm" style={{ color: mod.textColor }}>{mod.title}</h3>
              <p className="text-muted-foreground text-xs mt-0.5 line-clamp-2">{mod.desc}</p>
            </div>
            <div className="ml-auto text-muted-foreground flex-shrink-0 text-lg">›</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
