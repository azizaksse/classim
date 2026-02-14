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
    'hero.subtitle': 'موديلات فاخرة • قياسات متعددة • طلب سريع وآمن',
    'hero.cta.primary': 'احجز الآن',
    'hero.cta.secondary': 'تصفح الكتالوج',
    
    // Trust Badges
    'trust.delivery': 'توصيل لكل الولايات',
    'trust.payment': 'دفع عند الاستلام',
    'trust.size': 'تأكيد المقاس قبل الإرسال',
    
    // Size Chart
    'size.title': 'المقاسات المتوفرة',
    'size.subtitle': '',
    
    // Categories
    'category.costumes': 'كوستيم',
    'category.shoes': 'أحذية',
    'category.tshirts': 'تيشيرت',
    'category.accessories': 'إكسسوارات',
    
    // Product
    'product.rent': 'كراء',
    'product.sale': 'بيع',
    'product.sizes': 'المقاسات المتوفرة',
    'product.cta': 'اطلب الآن',
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
    'cta.subtitle': 'اطلب الآن وتم تأكيد طلبك بسرعة',
  },
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.catalogue': 'Catalogue',
    'nav.contact': 'Contact',
    
    // Hero
    'hero.title': 'Location & Vente de Costumes de Mariage',
    'hero.subtitle': 'Modeles premium • Tailles variees • Commande rapide et securisee',
    'hero.cta.primary': 'Réserver maintenant',
    'hero.cta.secondary': 'Voir le catalogue',
    
    // Trust Badges
    'trust.delivery': 'Livraison nationale',
    'trust.payment': 'Paiement à la livraison',
    'trust.size': 'Taille confirmée avant envoi',
    
    // Size Chart
    'size.title': 'Guide des tailles',
    'size.subtitle': '',
    
    // Categories
    'category.costumes': 'Costumes',
    'category.shoes': 'Chaussures',
    'category.tshirts': 'T-shirts',
    'category.accessories': 'Accessoires',
    
    // Product
    'product.rent': 'Location',
    'product.sale': 'Vente',
    'product.sizes': 'Tailles disponibles',
    'product.cta': 'Commander maintenant',
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
    'cta.subtitle': 'Passez votre commande maintenant et confirmez rapidement',
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
