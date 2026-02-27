import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useGetMeasurements, useSaveMeasurement } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, TrendingUp, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatDate, nanosToMs } from '../utils/pregnancyCalculations';

interface Props { onBack: () => void; }

export default function GrowthMonitoringPage({ onBack }: Props) {
  const { t } = useLanguage();
  const { data: measurements = [], isLoading } = useGetMeasurements();
  const saveMeasurement = useSaveMeasurement();

  const [showForm, setShowForm] = useState(false);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [headCirc, setHeadCirc] = useState('');
  const [measureDate, setMeasureDate] = useState('');

  const handleSave = async () => {
    if (!measureDate) { toast.error('Please enter a date'); return; }
    try {
      await saveMeasurement.mutateAsync({
        measurementId: `m_${Date.now()}`,
        timestamp: BigInt(new Date(measureDate).getTime()) * BigInt(1_000_000),
        weight: weight ? parseFloat(weight) : undefined,
        height: height ? parseFloat(height) : undefined,
        headCircumference: headCirc ? parseFloat(headCirc) : undefined,
      });
      toast.success(t.growth.measurementSaved);
      setShowForm(false);
      setWeight(''); setHeight(''); setHeadCirc(''); setMeasureDate('');
    } catch {
      toast.error(t.app.error);
    }
  };

  const chartData = [...measurements]
    .sort((a, b) => Number(a.timestamp - b.timestamp))
    .map((m) => ({
      date: formatDate(nanosToMs(m.timestamp)),
      weight: m.weight,
      height: m.height,
    }));

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="rounded-2xl p-4 text-white" style={{ backgroundColor: 'oklch(0.28 0.1 145)' }}>
        <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/10 -ml-2 mb-2 gap-1">
          <ArrowLeft className="h-4 w-4" />{t.app.back}
        </Button>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <TrendingUp className="h-5 w-5" style={{ color: 'oklch(0.72 0.16 55)' }} />{t.growth.title}
        </h2>
        <p className="text-sm mt-1" style={{ color: 'oklch(0.88 0.03 85)' }}>{t.growth.subtitle}</p>
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between">
          <CardTitle className="text-base" style={{ color: 'oklch(0.28 0.1 145)' }}>{t.growth.logMeasurement}</CardTitle>
          <Button size="sm" onClick={() => setShowForm(!showForm)}
            className="gap-1 text-white" style={{ backgroundColor: 'oklch(0.38 0.1 145)' }}>
            <Plus className="h-3 w-3" />{t.app.addNew}
          </Button>
        </CardHeader>
        {showForm && (
          <CardContent className="px-4 pb-4">
            <div className="bg-secondary rounded-xl p-3 space-y-3">
              <div>
                <Label className="text-xs">{t.growth.measurementDate} *</Label>
                <Input type="date" value={measureDate} onChange={(e) => setMeasureDate(e.target.value)} className="mt-1 h-8" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-xs">{t.growth.weight}</Label>
                  <Input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="kg" className="mt-1 h-8 text-sm" />
                </div>
                <div>
                  <Label className="text-xs">{t.growth.height}</Label>
                  <Input type="number" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="cm" className="mt-1 h-8 text-sm" />
                </div>
                <div>
                  <Label className="text-xs">HC (cm)</Label>
                  <Input type="number" step="0.1" value={headCirc} onChange={(e) => setHeadCirc(e.target.value)} placeholder="cm" className="mt-1 h-8 text-sm" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave} disabled={saveMeasurement.isPending}
                  className="text-white" style={{ backgroundColor: 'oklch(0.38 0.1 145)' }}>
                  {saveMeasurement.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : t.app.save}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>{t.app.cancel}</Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin" /></div>
      ) : measurements.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="p-6 text-center text-muted-foreground text-sm">{t.growth.noMeasurements}</CardContent>
        </Card>
      ) : (
        <>
          <Card className="shadow-card">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-base" style={{ color: 'oklch(0.28 0.1 145)' }}>{t.growth.chart.weightForAge}</CardTitle>
            </CardHeader>
            <CardContent className="px-2 pb-4">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="weight" stroke="oklch(0.72 0.16 55)" strokeWidth={2} name={t.growth.chart.childData} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm" style={{ color: 'oklch(0.28 0.1 145)' }}>Measurements History</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="space-y-2">
                {[...measurements].sort((a, b) => Number(b.timestamp - a.timestamp)).map((m, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-secondary text-sm">
                    <span className="text-muted-foreground text-xs">{formatDate(nanosToMs(m.timestamp))}</span>
                    <div className="flex gap-3 text-xs">
                      {m.weight && <span className="font-medium">{m.weight}kg</span>}
                      {m.height && <span className="font-medium">{m.height}cm</span>}
                      {m.headCircumference && <span className="font-medium">HC:{m.headCircumference}cm</span>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <Card className="shadow-card border-orange-200 bg-orange-50">
        <CardContent className="p-3 flex gap-2">
          <AlertTriangle className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-orange-700">
            Compare with WHO growth standards. Consult your healthcare provider if measurements fall outside normal ranges.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
