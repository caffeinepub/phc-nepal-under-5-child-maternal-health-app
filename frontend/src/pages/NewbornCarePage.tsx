import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, Star, Baby } from 'lucide-react';

interface Props { onBack: () => void; }

export default function NewbornCarePage({ onBack }: Props) {
  const { t } = useLanguage();
  const nc = t.newbornCare;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="rounded-2xl p-4 text-white" style={{ backgroundColor: 'oklch(0.28 0.1 145)' }}>
        <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/10 -ml-2 mb-2 gap-1">
          <ArrowLeft className="h-4 w-4" />{t.app.back}
        </Button>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Baby className="h-5 w-5" style={{ color: 'oklch(0.72 0.16 55)' }} />{nc.title}
        </h2>
        <p className="text-sm mt-1" style={{ color: 'oklch(0.88 0.03 85)' }}>{nc.subtitle}</p>
      </div>

      <Accordion type="multiple" defaultValue={['immediate']} className="space-y-2">
        <AccordionItem value="immediate" className="bg-card rounded-xl border shadow-card overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <span className="font-bold text-sm" style={{ color: 'oklch(0.28 0.1 145)' }}>{nc.sections.immediate}</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 space-y-3">
            {nc.immediate.steps.map((step, i) => (
              <div key={i} className="rounded-xl p-3" style={{ backgroundColor: 'oklch(0.94 0.03 145)' }}>
                <p className="font-semibold text-sm" style={{ color: 'oklch(0.28 0.1 145)' }}>{i + 1}. {step.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{step.content}</p>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="colostrum" className="bg-card rounded-xl border shadow-card overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <span className="font-bold text-sm" style={{ color: 'oklch(0.28 0.1 145)' }}>{nc.sections.colostrum}</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-3">
              <p className="text-sm font-bold text-yellow-800 flex items-center gap-1">
                <Star className="h-4 w-4" />{nc.colostrum.title}
              </p>
              <p className="text-xs text-yellow-700 mt-1">{nc.colostrum.content}</p>
            </div>
            <ul className="space-y-2">
              {nc.colostrum.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-yellow-600" />{b}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="breastfeeding" className="bg-card rounded-xl border shadow-card overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <span className="font-bold text-sm" style={{ color: 'oklch(0.28 0.1 145)' }}>{nc.sections.breastfeeding}</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <p className="text-sm text-muted-foreground mb-3">{nc.breastfeeding.content}</p>
            <ul className="space-y-1 mb-4">
              {nc.breastfeeding.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: 'oklch(0.38 0.1 145)' }} />{b}
                </li>
              ))}
            </ul>
            <div className="rounded-xl p-3" style={{ backgroundColor: 'oklch(0.94 0.03 145)' }}>
              <p className="font-semibold text-sm mb-2" style={{ color: 'oklch(0.28 0.1 145)' }}>{nc.breastfeeding.latch.title}</p>
              <ul className="space-y-1">
                {nc.breastfeeding.latch.steps.map((s, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                    <span className="font-bold" style={{ color: 'oklch(0.72 0.16 55)' }}>{i + 1}.</span>{s}
                  </li>
                ))}
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="problems" className="bg-card rounded-xl border shadow-card overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <span className="font-bold text-sm" style={{ color: 'oklch(0.28 0.1 145)' }}>{nc.sections.problems}</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 space-y-2">
            {nc.problems.issues.map((issue, i) => (
              <div key={i} className="rounded-xl p-3 border border-border">
                <p className="font-semibold text-sm text-orange-700">{issue.problem}</p>
                <p className="text-xs text-muted-foreground mt-1">→ {issue.solution}</p>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="replacement" className="bg-card rounded-xl border shadow-card overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <span className="font-bold text-sm" style={{ color: 'oklch(0.28 0.1 145)' }}>{nc.sections.replacement}</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <p className="text-sm text-muted-foreground mb-3">{nc.replacement.content}</p>
            <ul className="space-y-1 mb-4">
              {nc.replacement.guidelines.map((g, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: 'oklch(0.38 0.1 145)' }} />{g}
                </li>
              ))}
            </ul>
            <p className="font-semibold text-sm mb-2" style={{ color: 'oklch(0.28 0.1 145)' }}>{nc.replacement.products.title}</p>
            <div className="space-y-2">
              {nc.replacement.products.items.map((item, i) => (
                <Card key={i} className="shadow-xs">
                  <CardContent className="p-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.age}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.availability}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
