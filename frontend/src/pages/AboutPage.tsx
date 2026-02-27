import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Mail, Phone, ExternalLink } from 'lucide-react';
import { SiFacebook, SiYoutube, SiWhatsapp } from 'react-icons/si';

export default function AboutPage() {
  const { t } = useLanguage();
  const ab = t.about;

  const contactLinks = [
    {
      icon: <Globe className="h-5 w-5" />,
      label: ab.website,
      value: ab.contactDetails.website,
      href: 'https://www.phcnepal.com',
      color: '#166534',
      bg: '#dcfce7',
    },
    {
      icon: <Mail className="h-5 w-5" />,
      label: ab.email,
      value: ab.contactDetails.email,
      href: 'mailto:Info@phcnepal.com',
      color: '#1e40af',
      bg: '#dbeafe',
    },
    {
      icon: <SiWhatsapp className="h-5 w-5" />,
      label: ab.whatsapp,
      value: ab.contactDetails.whatsapp,
      href: 'https://wa.me/9779802791247',
      color: '#166534',
      bg: '#dcfce7',
      badge: ab.available247,
    },
  ];

  const socialLinks = [
    {
      icon: <SiFacebook className="h-5 w-5" />,
      label: ab.facebook,
      value: ab.contactDetails.facebook,
      href: 'https://www.facebook.com/phcnepaal/',
      color: '#1877F2',
      bg: '#dbeafe',
    },
    {
      icon: <SiYoutube className="h-5 w-5" />,
      label: ab.youtube,
      value: ab.contactDetails.youtube,
      href: 'https://www.youtube.com/@phcnepal',
      color: '#FF0000',
      bg: '#fee2e2',
    },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="rounded-2xl p-4 text-white" style={{ backgroundColor: 'oklch(0.28 0.1 145)' }}>
        <h2 className="text-xl font-bold">{ab.title}</h2>
        <p className="text-sm mt-1" style={{ color: 'oklch(0.88 0.03 85)' }}>{ab.subtitle}</p>
      </div>

      {/* Logo + Mission */}
      <Card className="shadow-card">
        <CardContent className="p-4 flex gap-4 items-start">
          <img
            src="/assets/generated/phc-nepal-logo.dim_256x256.png"
            alt="PHC Nepal"
            className="h-16 w-16 rounded-full object-cover border-2 flex-shrink-0"
            style={{ borderColor: 'oklch(0.72 0.16 55)' }}
          />
          <div>
            <h3 className="font-bold text-base" style={{ color: 'oklch(0.28 0.1 145)' }}>PHC Nepal</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{ab.mission}</p>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className="shadow-card">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-base" style={{ color: 'oklch(0.28 0.1 145)' }}>{ab.contact}</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-2">
          {contactLinks.map((link, i) => (
            <a
              key={i}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl border border-border hover:shadow-card transition-all"
            >
              <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: link.bg, color: link.color }}>
                {link.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">{link.label}</p>
                <p className="text-sm font-medium truncate" style={{ color: link.color }}>{link.value}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {link.badge && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: 'oklch(0.38 0.1 145)' }}>
                    {link.badge}
                  </span>
                )}
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              </div>
            </a>
          ))}
        </CardContent>
      </Card>

      {/* Social */}
      <Card className="shadow-card">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-base" style={{ color: 'oklch(0.28 0.1 145)' }}>{ab.followUs}</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-2">
          {socialLinks.map((link, i) => (
            <a
              key={i}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl border border-border hover:shadow-card transition-all"
            >
              <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: link.bg, color: link.color }}>
                {link.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">{link.label}</p>
                <p className="text-sm font-medium truncate" style={{ color: link.color }}>{link.value}</p>
              </div>
              <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            </a>
          ))}
        </CardContent>
      </Card>

      {/* Emergency */}
      <Card className="shadow-card border-red-200 bg-red-50">
        <CardContent className="p-4 flex gap-3">
          <Phone className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm text-red-700">Emergency Contacts</p>
            <div className="mt-2 space-y-1">
              <a href="tel:102" className="flex items-center gap-2 text-sm text-red-600 font-medium">
                📞 Nepal: 102 (Ambulance)
              </a>
              <a href="tel:108" className="flex items-center gap-2 text-sm text-red-600 font-medium">
                📞 India: 108 (Ambulance)
              </a>
              <a href="https://wa.me/9779802791247" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium" style={{ color: '#25D366' }}>
                <SiWhatsapp className="h-4 w-4" /> PHC Nepal: +977 9802791247 (24/7)
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
