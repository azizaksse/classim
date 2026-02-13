import { useState } from 'react';
import { useAction, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ShoppingCart, User, MapPin, Phone, Building, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { WILAYAS } from '@/constants/wilayas';

interface LeadFormProps {
  productName: string;
  unitPrice: number;
  selectedSize?: string | null;
  selectedColor?: string | null;
  selectedQuantity?: number;
}

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
      .enum(['sale'], {
        required_error: messages.orderType.required,
      }),
  });
};

type FormData = z.infer<ReturnType<typeof createFormSchema>>;

const LeadForm = ({ productName, unitPrice, selectedSize, selectedColor, selectedQuantity = 1 }: LeadFormProps) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTotal, setShowTotal] = useState(false);
  const [botField, setBotField] = useState("");
  const storeSettings = useQuery(api.settings.get);
  const submitOrder = useAction(api.orders.submit);
  const defaultDeliveryPrice = storeSettings?.delivery_price ?? 0;
  const deliveryPricesByWilaya = storeSettings?.delivery_prices_by_wilaya ?? {};

  const formSchema = createFormSchema(language);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      wilaya: '',
      city: '',
      deliveryPlace: 'home',
      orderType: 'sale',
    },
    mode: 'onBlur',
  });
  const selectedWilayaCode = form.watch("wilaya");
  const deliveryPrice = selectedWilayaCode
    ? (deliveryPricesByWilaya[selectedWilayaCode] ?? defaultDeliveryPrice)
    : defaultDeliveryPrice;
  const subtotal = unitPrice * selectedQuantity;
  const total = subtotal + deliveryPrice;

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const selectedWilaya = WILAYAS.find((w) => w.code === data.wilaya);
      const wilayaName = selectedWilaya
        ? (language === 'ar' ? selectedWilaya.nameAr : selectedWilaya.nameFr)
        : '';

      await submitOrder({
        product_name: productName,
        size: selectedSize || undefined,
        color: selectedColor || undefined,
        quantity: selectedQuantity,
        customer_name: data.name,
        phone: data.phone,
        wilaya_code: data.wilaya,
        wilaya_name: wilayaName || undefined,
        city: data.city,
        delivery_place: data.deliveryPlace,
        delivery_price: deliveryPrice,
        language,
        source: 'website_checkout_form',
        // Use a stable epoch value to avoid client/server clock skew false positives.
        form_started_at: 0,
        bot_field: botField,
      });
    } catch (error: any) {
      console.error('Order submission failed:', error);
      const rawMessage = String(error?.message || '');
      let description = language === 'ar'
        ? 'تأكد من المعلومات وحاول مرة أخرى.'
        : 'Please verify your data and try again.';

      if (rawMessage.includes('Too many attempts')) {
        description = language === 'ar'
          ? 'عدد المحاولات كبير. حاول بعد قليل.'
          : 'Too many attempts. Please try again later.';
      } else if (rawMessage.includes('Invalid phone number')) {
        description = language === 'ar'
          ? 'رقم الهاتف غير صحيح.'
          : 'Phone number is invalid.';
      } else if (rawMessage.includes('Please complete the form normally')) {
        description = language === 'ar'
          ? 'املأ النموذج ثم أعد المحاولة.'
          : 'Please fill the form normally and try again.';
      }

      toast({
        title: language === 'ar' ? 'تعذر إرسال الطلب' : 'Failed to submit order',
        description,
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    form.reset();
    setBotField("");
    setIsSubmitting(false);
    navigate("/thank-you", { state: { productName } });
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
                    {WILAYAS.map((w) => (
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

          <input type="hidden" value="sale" {...form.register("orderType")} />
          <input
            type="text"
            value={botField}
            onChange={(e) => setBotField(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => setShowTotal(true)}
          >
            {language === 'ar' ? 'حساب السعر الإجمالي' : 'Calculer le prix total'}
          </Button>

          {showTotal && (
            <div className="rounded-xl border border-border bg-secondary/40 p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {language === 'ar' ? `سعر المنتج x ${selectedQuantity}` : `Produit x ${selectedQuantity}`}
                </span>
                <span className="font-medium">
                  {subtotal.toLocaleString()} {language === 'ar' ? 'دج' : 'DA'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {language === 'ar' ? 'سعر التوصيل' : 'Livraison'}
                </span>
                <span className="font-medium">
                  {deliveryPrice.toLocaleString()} {language === 'ar' ? 'دج' : 'DA'}
                </span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between text-base font-semibold">
                <span>{language === 'ar' ? 'المبلغ الإجمالي' : 'Total a payer'}</span>
                <span className="text-primary">
                  {total.toLocaleString()} {language === 'ar' ? 'دج' : 'DA'}
                </span>
              </div>
            </div>
          )}

          <Button
            type="submit"
            variant="gold"
            size="lg"
            className="w-full mt-4"
            disabled={isSubmitting}
          >
            <ShoppingCart className="w-5 h-5" />
            {language === 'ar' ? 'تأكيد الطلب' : 'Confirmer la commande'}
          </Button>

          {/* Trust note */}
          <p className="text-xs text-muted-foreground text-center">
            {language === 'ar' 
              ? `✓ الدفع عند الاستلام • اختر الولاية ثم اضغط حساب السعر الإجمالي`
              : `✓ Paiement a la livraison • Choisissez la wilaya puis calculez le total`}
          </p>
        </form>
      </Form>
    </div>
  );
};

export default LeadForm;
