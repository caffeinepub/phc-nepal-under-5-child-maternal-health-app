import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Home, Heart, Users, User, Info } from 'lucide-react';

type Page = 'dashboard' | 'health' | 'community' | 'profile' | 'about';

interface BottomNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  const { t } = useLanguage();

  const items: { id: Page; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: t.nav.dashboard, icon: <Home className="h-5 w-5" /> },
    { id: 'health', label: t.nav.health, icon: <Heart className="h-5 w-5" /> },
    { id: 'community', label: t.nav.community, icon: <Users className="h-5 w-5" /> },
    { id: 'profile', label: t.nav.profile, icon: <User className="h-5 w-5" /> },
    { id: 'about', label: t.nav.about, icon: <Info className="h-5 w-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-lg">
      <div className="flex items-stretch max-w-2xl mx-auto">
        {items.map((item) => {
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 min-h-[56px] transition-colors ${
                active
                  ? 'border-t-2 border-phc-saffron'
                  : 'hover:bg-secondary'
              }`}
              style={active ? { color: 'oklch(0.72 0.16 55)' } : { color: 'oklch(0.38 0.1 145)' }}
            >
              {item.icon}
              <span className="text-[10px] font-semibold mt-0.5 leading-tight text-center">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
