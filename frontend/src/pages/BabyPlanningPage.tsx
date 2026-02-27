import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, Flower2, Heart, TestTube, Baby, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props { onBack: () => void; }

export default function BabyPlanningPage({ onBack }: Props) {
  const { t } = useLanguage();
  const bp = t.babyPlanning;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="rounded-2xl p-4 text-white" style={{ backgroundColor: 'oklch(0.28 0.1 145)' }}>
        <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/10 -ml-2 mb-2 gap-1">
          <ArrowLeft className="h-4 w-4" />{t.app.back}
        </Button>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Baby className="h-5 w-5" style={{ color: 'oklch(0.72 0.16 55)' }} />{bp.title}
        </h2>
        <p className="text-sm mt-1" style={{ color: 'oklch(0.88 0.03 85)' }}>{bp.subtitle}</p>
      </div>

      <Accordion type="multiple" defaultValue={['fertility']} className="space-y-2">
        {[
          { key: 'fertility', icon: <Flower2 className="h-4 w-4" style={{ color: 'oklch(0.72 0.16 55)' }} />, label: bp.sections.fertility, content: bp.fertility.content, items: bp.fertility.tips },
          { key: 'conception', icon: <Heart className="h-4 w-4 text-pink-500" />, label: bp.sections.conception, content: bp.conception.content, items: bp.conception.tips },
          { key: 'preconception', icon: <CheckCircle className="h-4 w-4 text-blue-500" />, label: bp.sections.preconception, content: bp.preconception.content, items: bp.preconception.tips },
        ].map((section) => (
          <AccordionItem key={section.key} value={section.key} className="bg-card rounded-xl border shadow-card overflow-hidden">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-2 font-bold" style={{ color: 'oklch(0.28 0.1 145)' }}>
                {section.icon}{section.label}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <p className="text-sm text-muted-foreground mb-3">{section.content}</p>
              <ul className="space-y-2">
                {section.items.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: 'oklch(0.38 0.1 145)' }} />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}

        <AccordionItem value="confirmation" className="bg-card rounded-xl border shadow-card overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-2 font-bold" style={{ color: 'oklch(0.28 0.1 145)' }}>
              <TestTube className="h-4 w-4 text-purple-500" />{bp.sections.confirmation}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <p className="text-sm text-muted-foreground mb-3">{bp.confirmation.content}</p>
            <div className="mb-3">
              <p className="text-sm font-semibold mb-2" style={{ color: 'oklch(0.28 0.1 145)' }}>Early Signs:</p>
              <ul className="space-y-1">
                {bp.confirmation.signs.map((s, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'oklch(0.72 0.16 55)' }} />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold mb-2" style={{ color: 'oklch(0.28 0.1 145)' }}>Confirmation Tests:</p>
              <ul className="space-y-1">
                {bp.confirmation.tests.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: 'oklch(0.38 0.1 145)' }} />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
