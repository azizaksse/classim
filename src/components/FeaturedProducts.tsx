import { useLanguage } from '@/contexts/LanguageContext';
import ProductCard from './ProductCard';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const featuredProducts = [
  {
    id: '1',
    nameAr: 'كوستيم كلاسيكي أسود',
    nameFr: 'Costume Classique Noir',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800',
    ],
    rentPrice: 8000,
    salePrice: 35000,
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'costumes',
  },
  {
    id: '2',
    nameAr: 'كوستيم أزرق ملكي',
    nameFr: 'Costume Bleu Royal',
    images: [
      'https://images.unsplash.com/photo-1598808503746-f34c53b9323e?q=80&w=800',
      'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=800',
    ],
    rentPrice: 9000,
    salePrice: 40000,
    sizes: ['M', 'L', 'XL'],
    category: 'costumes',
  },
  {
    id: '3',
    nameAr: 'كوستيم بيج فاخر',
    nameFr: 'Costume Beige Premium',
    images: [
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800',
      'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?q=80&w=800',
    ],
    rentPrice: 10000,
    salePrice: 45000,
    sizes: ['S', 'M', 'L'],
    category: 'costumes',
  },
  {
    id: '4',
    nameAr: 'كوستيم رمادي عصري',
    nameFr: 'Costume Gris Moderne',
    images: [
      'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=800',
      'https://images.unsplash.com/photo-1598808503746-f34c53b9323e?q=80&w=800',
    ],
    rentPrice: 8500,
    salePrice: 38000,
    sizes: ['M', 'L', 'XL'],
    category: 'costumes',
  },
];

const FeaturedProducts = () => {
  const { language, t, dir } = useLanguage();

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold ${language === 'ar' ? 'font-arabic' : 'font-display'}`}>
            <span className="text-gradient-gold">
              {language === 'ar' ? 'الأكثر طلباً' : 'Les plus demandés'}
            </span>
          </h2>
          <Button variant="goldOutline" asChild>
            <Link to="/catalogue" className="flex items-center gap-2">
              {t('hero.cta.secondary')}
              {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Link>
          </Button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
