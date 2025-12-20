import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

const CTASection = () => {
  const { t, language } = useLanguage();

  const whatsappNumber = '213XXXXXXXXX';
  const whatsappMessage = encodeURIComponent(t('whatsapp.greeting'));
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Title */}
          <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${language === 'ar' ? 'font-arabic' : 'font-display'}`}>
            <span className="text-gradient-gold">{t('cta.title')}</span>
          </h2>

          {/* Subtitle */}
          <p className="text-lg text-muted-foreground mb-10">
            {t('cta.subtitle')}
          </p>

          {/* CTA */}
          <Button
            variant="gold"
            size="xl"
            asChild
            className="shadow-gold gold-glow"
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-5 h-5" />
              {t('hero.cta.primary')}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
