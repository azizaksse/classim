import { useLanguage } from '@/contexts/LanguageContext';
import CategoryCard from './CategoryCard';

const categories = [
  {
    id: 'costumes',
    nameAr: 'كوستيم',
    nameFr: 'Costumes',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800',
    count: 24,
  },
  {
    id: 'show',
    nameAr: 'شو',
    nameFr: 'Show',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800',
    count: 12,
  },
  {
    id: 'tshirts',
    nameAr: 'تيشيرت',
    nameFr: 'T-shirts',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800',
    count: 18,
  },
  {
    id: 'accessories',
    nameAr: 'إكسسوارات',
    nameFr: 'Accessoires',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800',
    count: 32,
  },
];

const Categories = () => {
  const { language, t } = useLanguage();

  return (
    <section id="catalogue" className="py-20 bg-card/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${language === 'ar' ? 'font-arabic' : 'font-display'}`}>
            <span className="text-gradient-gold">{t('nav.catalogue')}</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CategoryCard {...category} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
