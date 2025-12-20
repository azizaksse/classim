import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import AnimatedSection from '@/components/AnimatedSection';
import { categories } from '@/data/products';

interface CategoryCardProps {
  id: string;
  nameAr: string;
  nameFr: string;
  image: string;
  count: number;
  index: number;
}

const CategoryCard = ({ id, nameAr, nameFr, image, count, index }: CategoryCardProps) => {
  const { language } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link 
        to={`/catalogue?category=${id}`}
        className="group relative overflow-hidden rounded-2xl aspect-[4/5] block"
      >
        <motion.div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-300" />
        
        {/* Gold Border on Hover */}
        <motion.div 
          className="absolute inset-0 border-2 border-transparent rounded-2xl"
          whileHover={{ borderColor: 'hsl(var(--primary) / 0.5)' }}
          transition={{ duration: 0.3 }}
        />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <motion.h3 
            className={`text-2xl font-bold text-foreground mb-2 ${language === 'ar' ? 'font-arabic' : 'font-display'}`}
            initial={{ y: 10, opacity: 0.8 }}
            whileHover={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {language === 'ar' ? nameAr : nameFr}
          </motion.h3>
          <p className="text-sm text-primary">
            {count} {language === 'ar' ? 'منتج' : 'produits'}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

const Categories = () => {
  const { language, t } = useLanguage();

  return (
    <section id="catalogue" className="py-20 bg-card/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <AnimatedSection className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${language === 'ar' ? 'font-arabic' : 'font-display'}`}>
            <span className="text-gradient-gold">{t('nav.catalogue')}</span>
          </h2>
        </AnimatedSection>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={category.id} {...category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
