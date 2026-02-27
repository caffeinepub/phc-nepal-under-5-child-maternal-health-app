import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useGetANCVisits, useGetImmunizations } from '../hooks/useQueries';
import type { UserProfile } from '../backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Calendar, AlertTriangle, Baby, Heart, Activity, Syringe,
  TrendingUp, Users, Utensils, BookOpen, Shield
} from 'lucide-react';
import { getGestationalAgeFromEDD, getTrimester, getChildAgeFromDob, nanosToMs } from '../utils/pregnancyCalculations';
import type { Translations } from '../i18n/config';

type ModulePage = 'babyPlanning' | 'pregnancy' | 'ancPnc' | 'dangerSigns' | 'nutrition'
  | 'newbornCare' | 'growth' | 'immunization' | 'milestones' | 'supplementaryFeeding'
  | 'community' | 'about';

interface DashboardPageProps {
  onNavigate: (page: ModulePage) => void;
  profile: UserProfile | null;
}

function getStageInfo(profile: UserProfile | null, t: Translations) {
  if (!profile) return { label: t.dashboard.stages.planning, progress: 0, detail: '' };

  if (profile.expectedDueDate) {
    const eddMs = nanosToMs(profile.expectedDueDate);
    const { weeks } = getGestationalAgeFromEDD(eddMs);
    const trimester = getTrimester(weeks);
    const progress = Math.min(100, Math.round((weeks / 40) * 100));
    const daysLeft = Math.max(0, Math.round((eddMs - Date.now()) / (24 * 60 * 60 * 1000)));
    const stageLabel =
      trimester === 1 ? t.dashboard.stages.firstTrimester
      : trimester === 2 ? t.dashboard.stages.secondTrimester
      : t.dashboard.stages.thirdTrimester;
    return { label: stageLabel, progress, detail: `${weeks} ${t.dashboard.weeksPregnant} · ${t.dashboard.dueIn} ${daysLeft} ${t.dashboard.days}` };
  }

  if (profile.childDob) {
    const dobMs = nanosToMs(profile.childDob);
    const { years, months, totalMonths } = getChildAgeFromDob(dobMs);
    const progress = Math.min(100, Math.round((totalMonths / 60) * 100));
    const detail = years > 0
      ? `${years} ${t.dashboard.yearsOld} ${months > 0 ? `${months} ${t.dashboard.monthsOld}` : ''}`
      : `${months} ${t.dashboard.monthsOld}`;
    return { label: t.dashboard.stages.childUnder5, progress, detail };
  }

  return { label: t.dashboard.stages.planning, progress: 0, detail: '' };
}

const MODULE_CARDS: { id: ModulePage; icon: React.ReactNode; bgColor: string; textColor: string }[] = [
  { id: 'babyPlanning', icon: <Baby className="h-5 w-5" />, bgColor: '#dcfce7', textColor: '#166534' },
  { id: 'pregnancy', icon: <Heart className="h-5 w-5" />, bgColor: '#fce7f3', textColor: '#9d174d' },
  { id: 'ancPnc', icon: <Calendar className="h-5 w-5" />, bgColor: '#dbeafe', textColor: '#1e40af' },
  { id: 'dangerSigns', icon: <AlertTriangle className="h-5 w-5" />, bgColor: '#fee2e2', textColor: '#991b1b' },
  { id: 'nutrition', icon: <Utensils className="h-5 w-5" />, bgColor: '#ffedd5', textColor: '#9a3412' },
  { id: 'newbornCare', icon: <Baby className="h-5 w-5" />, bgColor: '#f3e8ff', textColor: '#6b21a8' },
  { id: 'growth', icon: <TrendingUp className="h-5 w-5" />, bgColor: '#ccfbf1', textColor: '#134e4a' },
  { id: 'immunization', icon: <Syringe className="h-5 w-5" />, bgColor: '#e0e7ff', textColor: '#3730a3' },
  { id: 'milestones', icon: <Activity className="h-5 w-5" />, bgColor: '#fef9c3', textColor: '#713f12' },
  { id: 'supplementaryFeeding', icon: <Utensils className="h-5 w-5" />, bgColor: '#ecfccb', textColor: '#365314' },
  { id: 'community', icon: <Users className="h-5 w-5" />, bgColor: '#fef3c7', textColor: '#78350f' },
  { id: 'about', icon: <Shield className="h-5 w-5" />, bgColor: '#f0fdf4', textColor: '#14532d' },
];

function getModuleLabel(id: ModulePage, t: Translations): string {
  const map: Record<ModulePage, string> = {
    babyPlanning: t.nav.babyPlanning,
    pregnancy: t.nav.pregnancy,
    ancPnc: t.nav.ancPnc,
    dangerSigns: t.nav.dangerSigns,
    nutrition: t.nav.nutrition,
    newbornCare: t.nav.newbornCare,
    growth: t.nav.growth,
    immunization: t.nav.immunization,
    milestones: t.nav.milestones,
    supplementaryFeeding: t.nav.feeding,
    community: t.nav.community,
    about: t.nav.about,
  };
  return map[id];
}

export default function DashboardPage({ onNavigate, profile }: DashboardPageProps) {
  const { t } = useLanguage();
  const { data: ancVisits = [] } = useGetANCVisits();
  const { data: immunizations = [] } = useGetImmunizations();
  const stage = getStageInfo(profile, t);

  const pendingAnc = ancVisits.filter((v) => !v.completed).length;
  const pendingVaccines = immunizations.filter((v) => !v.completed).length;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="rounded-2xl p-4 text-white" style={{ backgroundColor: 'oklch(0.28 0.1 145)' }}>
        <p className="text-sm font-medium" style={{ color: 'oklch(0.85 0.12 75)' }}>{t.dashboard.welcome},</p>
        <h2 className="text-xl font-bold">{profile?.name || 'User'}</h2>
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <Badge className="font-bold text-xs" style={{ backgroundColor: 'oklch(0.72 0.16 55)', color: 'oklch(0.15 0.04 55)' }}>
              {stage.label}
            </Badge>
            <span className="text-xs" style={{ color: 'oklch(0.88 0.03 85)' }}>{stage.detail}</span>
          </div>
          {stage.progress > 0 && (
            <Progress value={stage.progress} className="h-2" />
          )}
        </div>
      </div>

      {(pendingAnc > 0 || pendingVaccines > 0) && (
        <div className="space-y-2">
          {pendingAnc > 0 && (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2">
              <Calendar className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <p className="text-xs text-blue-700 font-medium">{pendingAnc} ANC {t.app.pending}</p>
              <button onClick={() => onNavigate('ancPnc')} className="ml-auto text-xs text-blue-600 font-bold underline">{t.app.viewAll}</button>
            </div>
          )}
          {pendingVaccines > 0 && (
            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2">
              <Syringe className="h-4 w-4 text-orange-600 flex-shrink-0" />
              <p className="text-xs text-orange-700 font-medium">{pendingVaccines} vaccines {t.app.pending}</p>
              <button onClick={() => onNavigate('immunization')} className="ml-auto text-xs text-orange-600 font-bold underline">{t.app.viewAll}</button>
            </div>
          )}
        </div>
      )}

      <Card className="shadow-card">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-base flex items-center gap-2" style={{ color: 'oklch(0.28 0.1 145)' }}>
            <BookOpen className="h-4 w-4" style={{ color: 'oklch(0.72 0.16 55)' }} />
            {t.dashboard.quickAccess}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="grid grid-cols-3 gap-2">
            {MODULE_CARDS.map((mod) => (
              <button
                key={mod.id}
                onClick={() => onNavigate(mod.id)}
                className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border border-border hover:shadow-card transition-all active:scale-95"
                style={{ backgroundColor: mod.bgColor, color: mod.textColor }}
              >
                {mod.icon}
                <span className="text-[10px] font-semibold text-center leading-tight">
                  {getModuleLabel(mod.id, t)}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <button
        onClick={() => onNavigate('dangerSigns')}
        className="w-full flex items-center gap-3 bg-red-50 border-2 border-red-200 rounded-xl px-4 py-3 hover:bg-red-100 transition-colors"
      >
        <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
        <div className="text-left">
          <p className="text-red-700 font-bold text-sm">{t.dangerSigns.title}</p>
          <p className="text-red-500 text-xs">{t.dangerSigns.subtitle}</p>
        </div>
      </button>
    </div>
  );
}
