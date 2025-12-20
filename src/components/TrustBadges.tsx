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
            <div
              key={index}
              className="flex items-center gap-3 px-4 py-2 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <badge.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm md:text-base font-medium text-foreground">
                {badge.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
