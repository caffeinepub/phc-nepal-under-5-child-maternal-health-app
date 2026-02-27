import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Loader2, Shield } from 'lucide-react';
import { SiGoogle } from 'react-icons/si';

export default function LoginPage() {
  const { t } = useLanguage();
  const { login, isLoggingIn } = useInternetIdentity();

  const handleLogin = () => {
    try {
      login();
    } catch {
      // handled by hook
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="relative h-52 overflow-hidden">
        <img
          src="/assets/generated/hero-banner.dim_1200x400.png"
          alt="PHC Nepal"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4"
          style={{ backgroundColor: 'oklch(0.28 0.1 145 / 65%)' }}>
          <img
            src="/assets/generated/phc-nepal-logo.dim_256x256.png"
            alt="PHC Nepal Logo"
            className="h-16 w-16 rounded-full object-cover shadow-lg mb-2 border-2"
            style={{ borderColor: 'oklch(0.72 0.16 55)' }}
          />
          <h1 className="text-white font-bold text-xl text-center">{t.app.name}</h1>
          <p className="text-sm text-center mt-1" style={{ color: 'oklch(0.85 0.12 75)' }}>{t.app.tagline}</p>
        </div>
      </div>

      <div className="flex-1 flex items-start justify-center px-4 pt-6 pb-8">
        <div className="w-full max-w-sm">
          <div className="bg-card rounded-2xl shadow-card p-6 border border-border">
            <h2 className="font-bold text-xl text-center mb-1" style={{ color: 'oklch(0.28 0.1 145)' }}>
              {t.auth.loginTitle}
            </h2>
            <p className="text-muted-foreground text-sm text-center mb-6">{t.auth.loginSubtitle}</p>

            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full text-white font-semibold py-3 rounded-xl gap-2 mb-4"
              style={{ backgroundColor: 'oklch(0.38 0.1 145)' }}
            >
              {isLoggingIn ? (
                <><Loader2 className="h-4 w-4 animate-spin" />{t.auth.loggingIn}</>
              ) : (
                <><SiGoogle className="h-4 w-4" />{t.auth.loginWithGoogle}</>
              )}
            </Button>

            <div className="rounded-xl p-3 flex gap-2" style={{ backgroundColor: 'oklch(0.94 0.03 145)' }}>
              <Shield className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: 'oklch(0.38 0.1 145)' }} />
              <p className="text-xs" style={{ color: 'oklch(0.38 0.1 145)' }}>
                Secure login powered by Internet Identity. Your health data is private and encrypted on the blockchain.
              </p>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground">
                By{' '}
                <a href="https://www.phcnepal.com" target="_blank" rel="noopener noreferrer"
                  className="font-semibold hover:underline" style={{ color: 'oklch(0.72 0.16 55)' }}>
                  PHC Nepal
                </a>
                {' '}· Info@phcnepal.com
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {['🤰 Pregnancy Tracking', '💉 Immunization', '📈 Growth Monitoring', '👶 Milestones'].map((f) => (
              <div key={f} className="bg-card rounded-xl p-2.5 text-xs font-medium text-center border border-border shadow-xs"
                style={{ color: 'oklch(0.38 0.1 145)' }}>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
