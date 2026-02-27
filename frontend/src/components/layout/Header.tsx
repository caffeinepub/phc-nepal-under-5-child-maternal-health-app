import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSwitcher from '../LanguageSwitcher';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogOut, LogIn } from 'lucide-react';

export default function Header() {
  const { t } = useLanguage();
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        login();
      } catch (error: unknown) {
        if (error instanceof Error && error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 shadow-md" style={{ backgroundColor: 'oklch(0.28 0.1 145)' }}>
      <div className="flex items-center justify-between px-3 py-2 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src="/assets/generated/phc-nepal-logo.dim_256x256.png"
            alt="PHC Nepal"
            className="h-9 w-9 rounded-full object-cover border-2 flex-shrink-0"
            style={{ borderColor: 'oklch(0.72 0.16 55)' }}
          />
          <div className="min-w-0">
            <h1 className="text-white font-bold text-sm leading-tight truncate">{t.app.name}</h1>
            <p className="text-xs leading-tight hidden sm:block truncate" style={{ color: 'oklch(0.85 0.12 75)' }}>
              {t.app.tagline}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAuth}
            disabled={isLoggingIn}
            className="text-white hover:bg-white/10 hover:text-white px-2 gap-1"
          >
            {isLoggingIn ? (
              <span className="text-xs">{t.auth.loggingIn}</span>
            ) : isAuthenticated ? (
              <>
                <LogOut className="h-4 w-4" />
                <span className="text-xs hidden sm:inline">{t.auth.logout}</span>
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span className="text-xs hidden sm:inline">{t.auth.login}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
