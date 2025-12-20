import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { MessageCircle, User, MapPin, Phone, Building, Home, Tag } from 'lucide-react';

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

// Validation messages
const getValidationMessages = (language: 'ar' | 'fr') => ({
  name: {
    required: language === 'ar' ? 'الاسم مطلوب' : 'Le nom est requis',
    min: language === 'ar' ? 'الاسم يجب أن يكون 3 أحرف على الأقل' : 'Le nom doit contenir au moins 3 caractères',
    max: language === 'ar' ? 'الاسم يجب أن لا يتجاوز 50 حرف' : 'Le nom ne doit pas dépasser 50 caractères',
  },
  phone: {
    required: language === 'ar' ? 'رقم الهاتف مطلوب' : 'Le numéro de téléphone est requis',
    invalid: language === 'ar' ? 'رقم الهاتف غير صحيح (مثال: 0551234567)' : 'Numéro de téléphone invalide (ex: 0551234567)',
  },
  wilaya: {
    required: language === 'ar' ? 'الولاية مطلوبة' : 'La wilaya est requise',
  },
  city: {
    required: language === 'ar' ? 'المدينة مطلوبة' : 'La ville est requise',
    min: language === 'ar' ? 'المدينة يجب أن تكون حرفين على الأقل' : 'La ville doit contenir au moins 2 caractères',
    max: language === 'ar' ? 'المدينة يجب أن لا تتجاوز 50 حرف' : 'La ville ne doit pas dépasser 50 caractères',
  },
  deliveryPlace: {
    required: language === 'ar' ? 'مكان التوصيل مطلوب' : 'Le lieu de livraison est requis',
  },
  orderType: {
    required: language === 'ar' ? 'نوع الطلب مطلوب' : 'Le type de commande est requis',
  },
});

// Create schema based on language
const createFormSchema = (language: 'ar' | 'fr') => {
  const messages = getValidationMessages(language);
  
  return z.object({
    name: z
      .string()
      .min(1, messages.name.required)
      .min(3, messages.name.min)
      .max(50, messages.name.max)
      .trim(),
    phone: z
      .string()
      .min(1, messages.phone.required)
      .regex(/^(0)(5|6|7)[0-9]{8}$/, messages.phone.invalid),
    wilaya: z
      .string()
      .min(1, messages.wilaya.required),
    city: z
      .string()
      .min(1, messages.city.required)
      .min(2, messages.city.min)
      .max(50, messages.city.max)
      .trim(),
    deliveryPlace: z
      .enum(['home', 'desktop'], {
        required_error: messages.deliveryPlace.required,
      }),
    orderType: z
      .enum(['rent', 'sale'], {
        required_error: messages.orderType.required,
      }),
  });
};

type FormData = z.infer<ReturnType<typeof createFormSchema>>;

const LeadForm = ({ productName, selectedSize }: LeadFormProps) => {
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = createFormSchema(language);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      wilaya: '',
      city: '',
      deliveryPlace: 'home',
      orderType: 'rent',
    },
    mode: 'onBlur',
  });

  const whatsappNumber = '213XXXXXXXXX'; // Replace with actual number

  const getWhatsAppUrl = (data: FormData) => {
    const selectedWilaya = wilayas.find(w => w.code === data.wilaya);
    const wilayaName = selectedWilaya 
      ? (language === 'ar' ? selectedWilaya.nameAr : selectedWilaya.nameFr)
      : '';
    
    const deliveryPlaceText = language === 'ar'
      ? (data.deliveryPlace === 'home' ? 'المنزل' : 'المكتب')
      : (data.deliveryPlace === 'home' ? 'Domicile' : 'Bureau');

    const orderTypeText = language === 'ar'
      ? (data.orderType === 'rent' ? 'كراء' : 'شراء')
      : (data.orderType === 'rent' ? 'Location' : 'Achat');

    const message = language === 'ar'
      ? `السلام عليكم، أريد حجز:
📦 المنتج: ${productName}
📏 المقاس: ${selectedSize || 'غير محدد'}
🏷️ نوع الطلب: ${orderTypeText}

👤 الاسم: ${data.name}
📱 الهاتف: ${data.phone}
🏙️ الولاية: ${wilayaName}
🏘️ المدينة: ${data.city}
📍 مكان التوصيل: ${deliveryPlaceText}

شكراً لكم`
      : `Bonjour, je souhaite réserver:
📦 Produit: ${productName}
📏 Taille: ${selectedSize || 'Non spécifiée'}
🏷️ Type de commande: ${orderTypeText}

👤 Nom: ${data.name}
📱 Téléphone: ${data.phone}
🏙️ Wilaya: ${wilayaName}
🏘️ Ville: ${data.city}
📍 Lieu de livraison: ${deliveryPlaceText}

Merci`;

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  const { toast } = useToast();

  const onSubmit = (data: FormData) => {
    setIsSubmitting(true);
    const url = getWhatsAppUrl(data);
    window.open(url, '_blank');
    
    // Show success toast
    toast({
      title: language === 'ar' ? '✓ تم إرسال الطلب' : '✓ Commande envoyée',
      description: language === 'ar' 
        ? 'سيتم التواصل معك قريباً عبر واتساب'
        : 'Nous vous contacterons bientôt via WhatsApp',
      duration: 5000,
    });
    
    // Reset form after successful submission
    form.reset();
    setIsSubmitting(false);
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className={`text-xl font-bold text-foreground mb-5 ${language === 'ar' ? 'font-arabic' : 'font-display'}`}>
        {language === 'ar' ? 'معلومات الطلب' : 'Informations de commande'}
      </h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-foreground">
                  <User className="w-4 h-4 text-primary" />
                  {language === 'ar' ? 'الاسم الكامل' : 'Nom complet'}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={language === 'ar' ? 'محمد أحمد' : 'Mohamed Ahmed'}
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-destructive text-sm" />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-foreground">
                  <Phone className="w-4 h-4 text-primary" />
                  {language === 'ar' ? 'رقم الهاتف' : 'Numéro de téléphone'}
                </FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="0551234567"
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                    dir="ltr"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-destructive text-sm" />
              </FormItem>
            )}
          />

          {/* Wilaya */}
          <FormField
            control={form.control}
            name="wilaya"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  {language === 'ar' ? 'الولاية' : 'Wilaya'}
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full bg-secondary border-border text-foreground">
                      <SelectValue placeholder={language === 'ar' ? 'اختر ولايتك' : 'Sélectionnez votre wilaya'} />
                    </SelectTrigger>
                  </FormControl>
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
                <FormMessage className="text-destructive text-sm" />
              </FormItem>
            )}
          />

          {/* City */}
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-foreground">
                  <Building className="w-4 h-4 text-primary" />
                  {language === 'ar' ? 'المدينة / البلدية' : 'Ville / Commune'}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={language === 'ar' ? 'اسم المدينة' : 'Nom de la ville'}
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-destructive text-sm" />
              </FormItem>
            )}
          />

          {/* Delivery Place */}
          <FormField
            control={form.control}
            name="deliveryPlace"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-foreground">
                  <Home className="w-4 h-4 text-primary" />
                  {language === 'ar' ? 'مكان التوصيل' : 'Lieu de livraison'}
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
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
                </FormControl>
                <FormMessage className="text-destructive text-sm" />
              </FormItem>
            )}
          />

          {/* Order Type (Rent/Sale) */}
          <FormField
            control={form.control}
            name="orderType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-foreground">
                  <Tag className="w-4 h-4 text-primary" />
                  {language === 'ar' ? 'نوع الطلب' : 'Type de commande'}
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem value="rent" id="rent" className="border-primary text-primary" />
                      <Label htmlFor="rent" className="cursor-pointer text-foreground">
                        {language === 'ar' ? 'كراء' : 'Location'}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem value="sale" id="sale" className="border-primary text-primary" />
                      <Label htmlFor="sale" className="cursor-pointer text-foreground">
                        {language === 'ar' ? 'شراء' : 'Achat'}
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage className="text-destructive text-sm" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            variant="whatsapp"
            size="lg"
            className="w-full mt-4"
            disabled={isSubmitting}
          >
            <MessageCircle className="w-5 h-5" />
            {language === 'ar' ? 'أرسل الطلب عبر واتساب' : 'Envoyer via WhatsApp'}
          </Button>

          {/* Trust note */}
          <p className="text-xs text-muted-foreground text-center">
            {language === 'ar' 
              ? '✓ دفع عند الاستلام • ✓ توصيل لكل الولايات'
              : '✓ Paiement à la livraison • ✓ Livraison nationale'}
          </p>
        </form>
      </Form>
    </div>
  );
};

export default LeadForm;
