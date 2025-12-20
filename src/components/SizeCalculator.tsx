import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MessageCircle, Ruler, Scale, Check, MapPin } from 'lucide-react';

interface SizeResult {
  size: string;
  fit: 'slim' | 'regular';
  confidence: 'high' | 'medium';
}

const wilayas = [
  { code: '01', nameAr: 'أدرار', nameFr: 'Adrar' },
  { code: '02', nameAr: 'الشلف', nameFr: 'Chlef' },
  { code: '03', nameAr: 'الأغواط', nameFr: 'Laghouat' },
  { code: '04', nameAr: 'أم البواقي', nameFr: 'Oum El Bouaghi' },
  { code: '05', nameAr: 'باتنة', nameFr: 'Batna' },
  { code: '06', nameAr: 'بجاية', nameFr: 'Béjaïa' },
  { code: '07', nameAr: 'بسكرة', nameFr: 'Biskra' },
  { code: '08', nameAr: 'بشار', nameFr: 'Béchar' },
  { code: '09', nameAr: 'البليدة', nameFr: 'Blida' },
  { code: '10', nameAr: 'البويرة', nameFr: 'Bouira' },
  { code: '11', nameAr: 'تمنراست', nameFr: 'Tamanrasset' },
  { code: '12', nameAr: 'تبسة', nameFr: 'Tébessa' },
  { code: '13', nameAr: 'تلمسان', nameFr: 'Tlemcen' },
  { code: '14', nameAr: 'تيارت', nameFr: 'Tiaret' },
  { code: '15', nameAr: 'تيزي وزو', nameFr: 'Tizi Ouzou' },
  { code: '16', nameAr: 'الجزائر', nameFr: 'Alger' },
  { code: '17', nameAr: 'الجلفة', nameFr: 'Djelfa' },
  { code: '18', nameAr: 'جيجل', nameFr: 'Jijel' },
  { code: '19', nameAr: 'سطيف', nameFr: 'Sétif' },
  { code: '20', nameAr: 'سعيدة', nameFr: 'Saïda' },
  { code: '21', nameAr: 'سكيكدة', nameFr: 'Skikda' },
  { code: '22', nameAr: 'سيدي بلعباس', nameFr: 'Sidi Bel Abbès' },
  { code: '23', nameAr: 'عنابة', nameFr: 'Annaba' },
  { code: '24', nameAr: 'قالمة', nameFr: 'Guelma' },
  { code: '25', nameAr: 'قسنطينة', nameFr: 'Constantine' },
  { code: '26', nameAr: 'المدية', nameFr: 'Médéa' },
  { code: '27', nameAr: 'مستغانم', nameFr: 'Mostaganem' },
  { code: '28', nameAr: 'المسيلة', nameFr: "M'Sila" },
  { code: '29', nameAr: 'معسكر', nameFr: 'Mascara' },
  { code: '30', nameAr: 'ورقلة', nameFr: 'Ouargla' },
  { code: '31', nameAr: 'وهران', nameFr: 'Oran' },
  { code: '32', nameAr: 'البيض', nameFr: 'El Bayadh' },
  { code: '33', nameAr: 'إليزي', nameFr: 'Illizi' },
  { code: '34', nameAr: 'برج بوعريريج', nameFr: 'Bordj Bou Arréridj' },
  { code: '35', nameAr: 'بومرداس', nameFr: 'Boumerdès' },
  { code: '36', nameAr: 'الطارف', nameFr: 'El Tarf' },
  { code: '37', nameAr: 'تندوف', nameFr: 'Tindouf' },
  { code: '38', nameAr: 'تيسمسيلت', nameFr: 'Tissemsilt' },
  { code: '39', nameAr: 'الوادي', nameFr: 'El Oued' },
  { code: '40', nameAr: 'خنشلة', nameFr: 'Khenchela' },
  { code: '41', nameAr: 'سوق أهراس', nameFr: 'Souk Ahras' },
  { code: '42', nameAr: 'تيبازة', nameFr: 'Tipaza' },
  { code: '43', nameAr: 'ميلة', nameFr: 'Mila' },
  { code: '44', nameAr: 'عين الدفلى', nameFr: 'Aïn Defla' },
  { code: '45', nameAr: 'النعامة', nameFr: 'Naâma' },
  { code: '46', nameAr: 'عين تموشنت', nameFr: 'Aïn Témouchent' },
  { code: '47', nameAr: 'غرداية', nameFr: 'Ghardaïa' },
  { code: '48', nameAr: 'غليزان', nameFr: 'Relizane' },
  { code: '49', nameAr: 'تيميمون', nameFr: 'Timimoun' },
  { code: '50', nameAr: 'برج باجي مختار', nameFr: 'Bordj Badji Mokhtar' },
  { code: '51', nameAr: 'أولاد جلال', nameFr: 'Ouled Djellal' },
  { code: '52', nameAr: 'بني عباس', nameFr: 'Béni Abbès' },
  { code: '53', nameAr: 'عين صالح', nameFr: 'In Salah' },
  { code: '54', nameAr: 'عين قزام', nameFr: 'In Guezzam' },
  { code: '55', nameAr: 'توقرت', nameFr: 'Touggourt' },
  { code: '56', nameAr: 'جانت', nameFr: 'Djanet' },
  { code: '57', nameAr: 'المغير', nameFr: "El M'Ghair" },
  { code: '58', nameAr: 'المنيعة', nameFr: 'El Meniaa' },
];

const SizeCalculator = () => {
  const { t, language } = useLanguage();
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [wilaya, setWilaya] = useState('');
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

  const whatsappNumber = '213795443714';
  const getWhatsAppUrl = () => {
    if (!result) return '';
    
    const selectedWilaya = wilayas.find(w => w.code === wilaya);
    const wilayaName = selectedWilaya 
      ? (language === 'ar' ? selectedWilaya.nameAr : selectedWilaya.nameFr)
      : '___';
    
    const message = language === 'ar'
      ? `السلام عليكم، نحب نحجز كوستيم
الطول: ${height} سم
الوزن: ${weight} كغ
المقاس المقترح: ${result.size}
القصة: ${result.fit === 'slim' ? 'ضيق' : 'عادي'}
الولاية: ${wilayaName}`
      : `Bonjour, je souhaite réserver un costume
Taille: ${height} cm
Poids: ${weight} kg
Taille recommandée: ${result.size}
Coupe: ${result.fit === 'slim' ? 'Slim' : 'Regular'}
Wilaya: ${wilayaName}`;

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <section id="size-calculator" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 text-white ${language === 'ar' ? 'font-arabic' : 'font-display'}`}>
              {t('size.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('size.subtitle')}
            </p>
          </div>

          {/* Calculator Card */}
          <div className="glass-card rounded-2xl p-8 shadow-elegant">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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

            {/* Wilaya Selector */}
            <div className="space-y-2 mb-8">
              <Label htmlFor="wilaya" className="flex items-center gap-2 text-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                {language === 'ar' ? 'الولاية' : 'Wilaya'}
              </Label>
              <Select value={wilaya} onValueChange={setWilaya}>
                <SelectTrigger className="w-full bg-secondary border-border text-foreground">
                  <SelectValue placeholder={language === 'ar' ? 'اختر ولايتك' : 'Sélectionnez votre wilaya'} />
                </SelectTrigger>
                <SelectContent className="bg-card border-border max-h-[300px]">
                  {wilayas.map((w) => (
                    <SelectItem 
                      key={w.code} 
                      value={w.code}
                      className="text-foreground hover:bg-secondary focus:bg-secondary"
                    >
                      {w.code} - {language === 'ar' ? w.nameAr : w.nameFr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                    setWilaya('');
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
