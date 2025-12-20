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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MessageCircle, User, MapPin, Phone, Building, Home } from 'lucide-react';

interface LeadFormProps {
  productName: string;
  selectedSize?: string | null;
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

const LeadForm = ({ productName, selectedSize }: LeadFormProps) => {
  const { language } = useLanguage();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [city, setCity] = useState('');
  const [deliveryPlace, setDeliveryPlace] = useState<'home' | 'desktop'>('home');

  const whatsappNumber = '213XXXXXXXXX'; // Replace with actual number

  const isFormValid = name.trim() && phone.trim() && wilaya && city.trim();

  const getWhatsAppUrl = () => {
    const selectedWilaya = wilayas.find(w => w.code === wilaya);
    const wilayaName = selectedWilaya 
      ? (language === 'ar' ? selectedWilaya.nameAr : selectedWilaya.nameFr)
      : '';
    
    const deliveryPlaceText = language === 'ar'
      ? (deliveryPlace === 'home' ? 'المنزل' : 'المكتب')
      : (deliveryPlace === 'home' ? 'Domicile' : 'Bureau');

    const message = language === 'ar'
      ? `السلام عليكم، أريد حجز:
📦 المنتج: ${productName}
📏 المقاس: ${selectedSize || 'غير محدد'}

👤 الاسم: ${name}
📱 الهاتف: ${phone}
🏙️ الولاية: ${wilayaName}
🏘️ المدينة: ${city}
📍 مكان التوصيل: ${deliveryPlaceText}

شكراً لكم`
      : `Bonjour, je souhaite réserver:
📦 Produit: ${productName}
📏 Taille: ${selectedSize || 'Non spécifiée'}

👤 Nom: ${name}
📱 Téléphone: ${phone}
🏙️ Wilaya: ${wilayaName}
🏘️ Ville: ${city}
📍 Lieu de livraison: ${deliveryPlaceText}

Merci`;

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="glass-card rounded-2xl p-6 space-y-5">
      <h3 className={`text-xl font-bold text-foreground ${language === 'ar' ? 'font-arabic' : 'font-display'}`}>
        {language === 'ar' ? 'معلومات الطلب' : 'Informations de commande'}
      </h3>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center gap-2 text-foreground">
          <User className="w-4 h-4 text-primary" />
          {language === 'ar' ? 'الاسم الكامل' : 'Nom complet'}
        </Label>
        <Input
          id="name"
          type="text"
          placeholder={language === 'ar' ? 'محمد أحمد' : 'Mohamed Ahmed'}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="flex items-center gap-2 text-foreground">
          <Phone className="w-4 h-4 text-primary" />
          {language === 'ar' ? 'رقم الهاتف' : 'Numéro de téléphone'}
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="0X XX XX XX XX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
          dir="ltr"
        />
      </div>

      {/* Wilaya */}
      <div className="space-y-2">
        <Label htmlFor="wilaya" className="flex items-center gap-2 text-foreground">
          <MapPin className="w-4 h-4 text-primary" />
          {language === 'ar' ? 'الولاية' : 'Wilaya'}
        </Label>
        <Select value={wilaya} onValueChange={setWilaya}>
          <SelectTrigger className="w-full bg-secondary border-border text-foreground">
            <SelectValue placeholder={language === 'ar' ? 'اختر ولايتك' : 'Sélectionnez votre wilaya'} />
          </SelectTrigger>
          <SelectContent className="bg-card border-border max-h-[300px] z-50">
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

      {/* City */}
      <div className="space-y-2">
        <Label htmlFor="city" className="flex items-center gap-2 text-foreground">
          <Building className="w-4 h-4 text-primary" />
          {language === 'ar' ? 'المدينة / البلدية' : 'Ville / Commune'}
        </Label>
        <Input
          id="city"
          type="text"
          placeholder={language === 'ar' ? 'اسم المدينة' : 'Nom de la ville'}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Delivery Place */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-foreground">
          <Home className="w-4 h-4 text-primary" />
          {language === 'ar' ? 'مكان التوصيل' : 'Lieu de livraison'}
        </Label>
        <RadioGroup
          value={deliveryPlace}
          onValueChange={(value) => setDeliveryPlace(value as 'home' | 'desktop')}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <RadioGroupItem value="home" id="home" className="border-primary text-primary" />
            <Label htmlFor="home" className="cursor-pointer text-foreground flex items-center gap-2">
              <Home className="w-4 h-4" />
              {language === 'ar' ? 'المنزل' : 'Domicile'}
            </Label>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <RadioGroupItem value="desktop" id="desktop" className="border-primary text-primary" />
            <Label htmlFor="desktop" className="cursor-pointer text-foreground flex items-center gap-2">
              <Building className="w-4 h-4" />
              {language === 'ar' ? 'المكتب' : 'Bureau'}
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Submit Button */}
      {isFormValid ? (
        <Button
          variant="whatsapp"
          size="lg"
          className="w-full mt-4"
          asChild
        >
          <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="w-5 h-5" />
            {language === 'ar' ? 'أرسل الطلب عبر واتساب' : 'Envoyer via WhatsApp'}
          </a>
        </Button>
      ) : (
        <Button
          variant="whatsapp"
          size="lg"
          className="w-full mt-4"
          disabled
        >
          <MessageCircle className="w-5 h-5" />
          {language === 'ar' ? 'أكمل البيانات للطلب' : 'Complétez le formulaire'}
        </Button>
      )}

      {/* Trust note */}
      <p className="text-xs text-muted-foreground text-center">
        {language === 'ar' 
          ? '✓ دفع عند الاستلام • ✓ توصيل لكل الولايات'
          : '✓ Paiement à la livraison • ✓ Livraison nationale'}
      </p>
    </div>
  );
};

export default LeadForm;
