import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageCircle, Ruler, Scale, Check } from 'lucide-react';

interface SizeResult {
  size: string;
  fit: 'slim' | 'regular';
  confidence: 'high' | 'medium';
}

const SizeCalculator = () => {
  const { t, language } = useLanguage();
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState<SizeResult | null>(null);

  const calculateSize = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (!h || !w) return;

    // BMI-based size calculation
    const bmi = w / ((h / 100) ** 2);
    
    let size: string;
    let fit: 'slim' | 'regular';
    let confidence: 'high' | 'medium';

    // Size based on height and BMI
    if (h < 165) {
      size = bmi < 22 ? 'S' : bmi < 25 ? 'M' : 'L';
    } else if (h < 175) {
      size = bmi < 21 ? 'S' : bmi < 24 ? 'M' : bmi < 27 ? 'L' : 'XL';
    } else if (h < 185) {
      size = bmi < 22 ? 'M' : bmi < 25 ? 'L' : 'XL';
    } else {
      size = bmi < 23 ? 'L' : 'XL';
    }

    // Fit recommendation
    fit = bmi < 23 ? 'slim' : 'regular';

    // Confidence based on how standard the measurements are
    confidence = (h >= 165 && h <= 185 && w >= 60 && w <= 90) ? 'high' : 'medium';

    setResult({ size, fit, confidence });
  };

  const whatsappNumber = '213XXXXXXXXX'; // Replace with actual number
  const getWhatsAppUrl = () => {
    if (!result) return '';
    
    const message = language === 'ar'
      ? `السلام عليكم، نحب نحجز كوستيم
الطول: ${height} سم
الوزن: ${weight} كغ
المقاس المقترح: ${result.size}
القصة: ${result.fit === 'slim' ? 'ضيق' : 'عادي'}
الولاية: ___`
      : `Bonjour, je souhaite réserver un costume
Taille: ${height} cm
Poids: ${weight} kg
Taille recommandée: ${result.size}
Coupe: ${result.fit === 'slim' ? 'Slim' : 'Regular'}
Wilaya: ___`;

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <section id="size-calculator" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${language === 'ar' ? 'font-arabic' : 'font-display'}`}>
              <span className="text-gradient-gold">{t('size.title')}</span>
            </h2>
            <p className="text-muted-foreground">
              {t('size.subtitle')}
            </p>
          </div>

          {/* Calculator Card */}
          <div className="glass-card rounded-2xl p-8 shadow-elegant">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Height Input */}
              <div className="space-y-2">
                <Label htmlFor="height" className="flex items-center gap-2 text-foreground">
                  <Ruler className="w-4 h-4 text-primary" />
                  {t('size.height')}
                </Label>
                <Input
                  id="height"
                  type="number"
                  placeholder={language === 'ar' ? '175' : '175'}
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Weight Input */}
              <div className="space-y-2">
                <Label htmlFor="weight" className="flex items-center gap-2 text-foreground">
                  <Scale className="w-4 h-4 text-primary" />
                  {t('size.weight')}
                </Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder={language === 'ar' ? '75' : '75'}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Calculate Button */}
            {!result && (
              <Button
                variant="gold"
                size="lg"
                className="w-full"
                onClick={calculateSize}
                disabled={!height || !weight}
              >
                {t('size.calculate')}
              </Button>
            )}

            {/* Result */}
            {result && (
              <div className="animate-scale-in">
                {/* Result Display */}
                <div className="bg-secondary/50 rounded-xl p-6 mb-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    {/* Size */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{t('size.result')}</p>
                      <p className="text-4xl font-bold text-gradient-gold">{result.size}</p>
                    </div>

                    {/* Fit */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{t('size.fit')}</p>
                      <p className="text-lg font-semibold text-foreground">
                        {result.fit === 'slim' ? t('size.fit.slim') : t('size.fit.regular')}
                      </p>
                    </div>

                    {/* Confidence */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{t('size.confidence')}</p>
                      <div className="flex items-center justify-center gap-1">
                        <Check className={`w-4 h-4 ${result.confidence === 'high' ? 'text-green-500' : 'text-yellow-500'}`} />
                        <p className="text-sm font-medium text-foreground">
                          {result.confidence === 'high' ? t('size.confidence.high') : t('size.confidence.medium')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Disclaimer */}
                <p className="text-xs text-muted-foreground text-center mb-6">
                  {t('size.disclaimer')}
                </p>

                {/* WhatsApp CTA */}
                <Button
                  variant="whatsapp"
                  size="lg"
                  className="w-full"
                  asChild
                >
                  <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5" />
                    {t('size.cta')}
                  </a>
                </Button>

                {/* Reset */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-3 text-muted-foreground"
                  onClick={() => {
                    setResult(null);
                    setHeight('');
                    setWeight('');
                  }}
                >
                  {language === 'ar' ? 'إعادة الحساب' : 'Recalculer'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SizeCalculator;
