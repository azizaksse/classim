import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Truck, CreditCard, Ruler } from 'lucide-react';

const TrustBadges = () => {
  const { t } = useLanguage();

  const badges = [
    {
      icon: Truck,
      text: t('trust.delivery'),
    },
    {
      icon: CreditCard,
      text: t('trust.payment'),
    },
    {
      icon: Ruler,
      text: t('trust.size'),
    },
  ];

  return (
    <section id="trust" className="py-12 bg-card/50 border-y border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
          {badges.map((badge, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-3 px-4 py-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <badge.icon className="w-5 h-5 text-primary" />
              </motion.div>
              <span className="text-sm md:text-base font-medium text-foreground">
                {badge.text}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
