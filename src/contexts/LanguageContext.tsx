import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.catalogue': 'الكتالوج',
    'nav.contact': 'اتصل بنا',
    
    // Hero
    'hero.title': 'كراء و بيع كوستيم الأفراح',
    'hero.subtitle': 'موديلات فاخرة • قياسات متعددة • حجز سريع عبر واتساب',
    'hero.cta.primary': 'احجز الآن',
    'hero.cta.secondary': 'تصفح الكتالوج',
    
    // Trust Badges
    'trust.delivery': 'توصيل لكل الولايات',
    'trust.payment': 'دفع عند الاستلام',
    'trust.size': 'تأكيد المقاس قبل الإرسال',
    
    // Size Calculator
    'size.title': 'اكتشف مقاسك المثالي',
    'size.subtitle': 'أدخل طولك ووزنك لنقترح لك المقاس الأنسب',
    'size.height': 'الطول (سم)',
    'size.weight': 'الوزن (كغ)',
    'size.calculate': 'احسب مقاسي',
    'size.result': 'مقاسك المقترح',
    'size.fit': 'القصة',
    'size.fit.slim': 'ضيق',
    'size.fit.regular': 'عادي',
    'size.confidence': 'الدقة',
    'size.confidence.high': 'عالية',
    'size.confidence.medium': 'متوسطة',
    'size.disclaimer': 'المقاس المقترح تقريبي ونؤكده معك قبل الإرسال',
    'size.cta': 'احجز بهذا المقاس',
    
    // Categories
    'category.costumes': 'كوستيم',
    'category.show': 'شو',
    'category.tshirts': 'تيشيرت',
    'category.accessories': 'إكسسوارات',
    
    // Product
    'product.rent': 'كراء',
    'product.sale': 'بيع',
    'product.sizes': 'المقاسات المتوفرة',
    'product.cta': 'احجز عبر واتساب',
    'product.delivery': 'توصيل مجاني لكل الولايات',
    'product.cod': 'الدفع عند الاستلام',
    
    // WhatsApp
    'whatsapp.greeting': 'السلام عليكم، نحب نحجز كوستيم',
    'whatsapp.height': 'الطول',
    'whatsapp.weight': 'الوزن',
    'whatsapp.size': 'المقاس المقترح',
    'whatsapp.type': 'كراء / بيع',
    'whatsapp.wilaya': 'الولاية',
    
    // Footer
    'footer.rights': 'جميع الحقوق محفوظة',
    'footer.brand': 'كلاسيمو',
    
    // CTA
    'cta.title': 'جاهز لتتألق في مناسبتك؟',
    'cta.subtitle': 'تواصل معنا الآن واحجز كوستيمك المثالي',
  },
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.catalogue': 'Catalogue',
    'nav.contact': 'Contact',
    
    // Hero
    'hero.title': 'Location & Vente de Costumes de Mariage',
    'hero.subtitle': 'Modèles premium • Tailles variées • Réservation via WhatsApp',
    'hero.cta.primary': 'Réserver maintenant',
    'hero.cta.secondary': 'Voir le catalogue',
    
    // Trust Badges
    'trust.delivery': 'Livraison nationale',
    'trust.payment': 'Paiement à la livraison',
    'trust.size': 'Taille confirmée avant envoi',
    
    // Size Calculator
    'size.title': 'Trouvez votre taille idéale',
    'size.subtitle': 'Entrez votre taille et poids pour une recommandation personnalisée',
    'size.height': 'Taille (cm)',
    'size.weight': 'Poids (kg)',
    'size.calculate': 'Calculer ma taille',
    'size.result': 'Taille recommandée',
    'size.fit': 'Coupe',
    'size.fit.slim': 'Slim',
    'size.fit.regular': 'Regular',
    'size.confidence': 'Précision',
    'size.confidence.high': 'Haute',
    'size.confidence.medium': 'Moyenne',
    'size.disclaimer': 'Taille estimée, confirmée avec vous avant l\'envoi',
    'size.cta': 'Réserver avec cette taille',
    
    // Categories
    'category.costumes': 'Costumes',
    'category.show': 'Show',
    'category.tshirts': 'T-shirts',
    'category.accessories': 'Accessoires',
    
    // Product
    'product.rent': 'Location',
    'product.sale': 'Vente',
    'product.sizes': 'Tailles disponibles',
    'product.cta': 'Réserver via WhatsApp',
    'product.delivery': 'Livraison gratuite nationale',
    'product.cod': 'Paiement à la livraison',
    
    // WhatsApp
    'whatsapp.greeting': 'Bonjour, je souhaite réserver un costume',
    'whatsapp.height': 'Taille',
    'whatsapp.weight': 'Poids',
    'whatsapp.size': 'Taille recommandée',
    'whatsapp.type': 'Location / Vente',
    'whatsapp.wilaya': 'Wilaya',
    
    // Footer
    'footer.rights': 'Tous droits réservés',
    'footer.brand': 'Classimo',
    
    // CTA
    'cta.title': 'Prêt à briller lors de votre événement ?',
    'cta.subtitle': 'Contactez-nous maintenant et réservez votre costume idéal',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
