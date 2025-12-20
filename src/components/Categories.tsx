import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { categories } from '@/data/products';

interface CategoryCardProps {
  id: string;
  nameAr: string;
  nameFr: string;
  image: string;
  count: number;
}

const CategoryCard = ({ id, nameAr, nameFr, image, count }: CategoryCardProps) => {
  const { language } = useLanguage();

  return (
    <Link 
      to={`/catalogue?category=${id}`}
      className="group relative overflow-hidden rounded-2xl aspect-[4/5] hover-lift"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
        style={{ backgroundImage: `url(${image})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-300" />
      
      {/* Gold Border on Hover */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/50 rounded-2xl transition-colors duration-300" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <h3 className={`text-2xl font-bold text-foreground mb-2 ${language === 'ar' ? 'font-arabic' : 'font-display'}`}>
          {language === 'ar' ? nameAr : nameFr}
        </h3>
        <p className="text-sm text-primary">
          {count} {language === 'ar' ? 'منتج' : 'produits'}
        </p>
      </div>
    </Link>
  );
};

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
