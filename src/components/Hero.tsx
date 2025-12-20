import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { MessageCircle, ArrowDown } from 'lucide-react';
import logo from '@/assets/logo.jpg';

const Hero = () => {
  const { t, language } = useLanguage();

  const whatsappNumber = '213795443714';
  const whatsappMessage = encodeURIComponent(t('whatsapp.greeting'));
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/herobackground.mp4" type="video/mp4" />
      </video>
      
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-background/70" />
      
      {/* Gold accent lines */}
      <motion.div 
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />

      <div className="container mx-auto px-4 relative z-10 pt-24 md:pt-28">
        <div className="max-w-4xl mx-auto text-center">
          {/* Floating Logo */}
          <motion.div 
            className="inline-block mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-primary/50 shadow-gold"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img 
                src={logo} 
                alt="Classimo Logo" 
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h1 
            className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 ${
              language === 'ar' ? 'font-arabic' : 'font-display'
            }`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="text-white">{t('hero.title')}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* CTAs */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            className="mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.a 
              href="#trust" 
              className="inline-flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowDown className="w-5 h-5" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
