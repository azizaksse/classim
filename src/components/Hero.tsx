import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { MessageCircle, ArrowDown } from 'lucide-react';

const Hero = () => {
  const { t, language } = useLanguage();

  const whatsappNumber = '213XXXXXXXXX'; // Replace with actual number
  const whatsappMessage = encodeURIComponent(t('whatsapp.greeting'));
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card" />
      
      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      
      {/* Gold accent lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto px-4 relative z-10 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Brand Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">
              {language === 'ar' ? 'كلاسيمو' : 'Classimo'}
            </span>
          </div>

          {/* Title */}
          <h1 
            className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up ${
              language === 'ar' ? 'font-arabic' : 'font-display'
            }`}
            style={{ animationDelay: '0.1s' }}
          >
            <span className="text-gradient-gold">{t('hero.title')}</span>
          </h1>

          {/* Subtitle */}
          <p 
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up"
            style={{ animationDelay: '0.2s' }}
          >
            {t('hero.subtitle')}
          </p>

          {/* CTAs */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
            style={{ animationDelay: '0.3s' }}
          >
            <Button
              variant="gold"
              size="xl"
              asChild
              className="w-full sm:w-auto"
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5" />
                {t('hero.cta.primary')}
              </a>
            </Button>

            <Button
              variant="goldOutline"
              size="xl"
              asChild
              className="w-full sm:w-auto"
            >
              <a href="#catalogue">
                {t('hero.cta.secondary')}
              </a>
            </Button>
          </div>

          {/* Scroll Indicator */}
          <div 
            className="mt-16 animate-fade-in"
            style={{ animationDelay: '0.5s' }}
          >
            <a href="#trust" className="inline-flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <ArrowDown className="w-5 h-5 animate-bounce" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
