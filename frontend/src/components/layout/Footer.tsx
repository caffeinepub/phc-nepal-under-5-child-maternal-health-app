import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Heart, Phone } from 'lucide-react';
import { SiFacebook, SiYoutube, SiWhatsapp } from 'react-icons/si';

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname || 'phc-nepal-health' : 'phc-nepal-health'
  );

  return (
    <footer className="mt-8 pb-20" style={{ backgroundColor: 'oklch(0.28 0.1 145)', color: 'oklch(0.97 0.018 85)' }}>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 mb-4 bg-red-900/30 border border-red-400/30">
          <Phone className="h-4 w-4 text-red-300 flex-shrink-0" />
          <span className="text-xs text-red-200">{t.footer.emergency}</span>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <a href="https://wa.me/9779802791247" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs hover:underline" style={{ color: 'oklch(0.85 0.12 75)' }}>
            <SiWhatsapp className="h-4 w-4" /><span>WhatsApp</span>
          </a>
          <a href="https://www.facebook.com/phcnepaal/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs hover:underline" style={{ color: 'oklch(0.85 0.12 75)' }}>
            <SiFacebook className="h-4 w-4" /><span>Facebook</span>
          </a>
          <a href="https://www.youtube.com/@phcnepal" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs hover:underline" style={{ color: 'oklch(0.85 0.12 75)' }}>
            <SiYoutube className="h-4 w-4" /><span>YouTube</span>
          </a>
        </div>
        <div className="border-t pt-3 flex flex-col sm:flex-row items-center justify-between gap-2"
          style={{ borderColor: 'oklch(0.38 0.1 145)' }}>
          <p className="text-xs" style={{ color: 'oklch(0.88 0.03 85)' }}>
            © {year} PHC Nepal. {t.footer.rights}.
          </p>
          <p className="text-xs flex items-center gap-1" style={{ color: 'oklch(0.88 0.03 85)' }}>
            {t.footer.builtWith}{' '}
            <Heart className="h-3 w-3 fill-current" style={{ color: 'oklch(0.72 0.16 55)' }} />{' '}
            {t.footer.using}{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:underline"
              style={{ color: 'oklch(0.72 0.16 55)' }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
