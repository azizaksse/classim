import { useLanguage } from '@/contexts/LanguageContext';
const sizeChart = [
  { range: '42 – 44', size: 'S' },
  { range: '46 – 48', size: 'M' },
  { range: '50 – 52', size: 'L' },
  { range: '54 – 56', size: 'XL' },
  { range: '58 – 60', size: 'XXL' },
  { range: '62 – 64', size: '3XL / XXXL' },
];

const SizeCalculator = () => {
  const { t, language } = useLanguage();

  return (
    <section id="size-calculator" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 text-foreground ${language === 'ar' ? 'font-arabic' : 'font-display'}`}>
              {t('size.title')}
            </h2>
            {t('size.subtitle') !== 'size.subtitle' && (
              <p className="text-muted-foreground">
                {t('size.subtitle')}
              </p>
            )}
          </div>

          {/* Size Chart Card */}
          <div className="glass-card rounded-2xl p-8 shadow-elegant">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sizeChart.map((item) => (
                <div
                  key={item.size}
                  className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-4 py-3"
                >
                  <span className="text-sm text-muted-foreground" dir="ltr">{item.range}</span>
                  <span className="text-lg font-semibold text-foreground">{item.size}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SizeCalculator;
