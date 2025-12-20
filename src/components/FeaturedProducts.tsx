import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductCard from './ProductCard';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import { products } from '@/data/products';

const FeaturedProducts = () => {
  const { language, t, dir } = useLanguage();

  // Get first 4 products for featured section
  const featuredProducts = products.slice(0, 4);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <AnimatedSection className="flex items-center justify-between mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold text-foreground ${language === 'ar' ? 'font-arabic' : 'font-display'}`}>
            {language === 'ar' ? 'الأكثر طلباً' : 'Les plus demandés'}
          </h2>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="goldOutline" asChild>
              <Link to="/catalogue" className="flex items-center gap-2">
                {t('hero.cta.secondary')}
                {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>
            </Button>
          </motion.div>
        </AnimatedSection>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <ProductCard {...product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
