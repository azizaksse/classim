import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

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

export default CategoryCard;
