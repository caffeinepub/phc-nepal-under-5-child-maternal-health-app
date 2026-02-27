import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft, Phone } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';

interface Props { onBack: () => void; }

export default function DangerSignsPage({ onBack }: Props) {
  const { t } = useLanguage();
  const ds = t.dangerSigns;

  const sections = [
    { key: 'pregnancy', label: ds.sections.pregnancy, items: ds.pregnancy, color: '#fee2e2', textColor: '#991b1b' },
    { key: 'labor', label: ds.sections.labor, items: ds.labor, color: '#fef3c7', textColor: '#92400e' },
    { key: 'postnatal', label: ds.sections.postnatal, items: ds.postnatal, color: '#fce7f3', textColor: '#9d174d' },
    { key: 'newborn', label: ds.sections.newborn, items: ds.newborn, color: '#ede9fe', textColor: '#5b21b6' },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="rounded-2xl p-4 text-white" style={{ backgroundColor: 'oklch(0.55 0.22 25)' }}>
        <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/10 -ml-2 mb-2 gap-1">
          <ArrowLeft className="h-4 w-4" />{t.app.back}
        </Button>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />{ds.title}
        </h2>
        <p className="text-sm mt-1 text-red-100">{ds.subtitle}</p>
      </div>

      {/* Emergency contacts */}
      <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 space-y-2">
        <p className="font-bold text-red-700 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />{ds.emergency}
        </p>
        <div className="flex flex-col gap-2">
          <a href="tel:102" className="flex items-center gap-2 bg-red-600 text-white rounded-xl px-4 py-2 font-semibold text-sm">
            <Phone className="h-4 w-4" />Nepal: 102 | India: 108
          </a>
          <a href="https://wa.me/9779802791247" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl px-4 py-2 font-semibold text-sm text-white"
            style={{ backgroundColor: '#25D366' }}>
            <SiWhatsapp className="h-4 w-4" />{ds.whatsapp} (+977 9802791247)
          </a>
        </div>
      </div>

      {sections.map((section) => (
        <Card key={section.key} className="shadow-card overflow-hidden">
          <CardHeader className="pb-2 pt-3 px-4" style={{ backgroundColor: section.color }}>
            <CardTitle className="text-sm font-bold" style={{ color: section.textColor }}>
              ⚠️ {section.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-3 space-y-2">
            {section.items.map((item, i) => (
              <div key={i} className="rounded-xl p-3 border" style={{ backgroundColor: section.color + '60', borderColor: section.color }}>
                <p className="font-semibold text-sm" style={{ color: section.textColor }}>{item.sign}</p>
                <p className="text-xs text-muted-foreground mt-1">→ {item.action}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
