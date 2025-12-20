import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import PageTransition from '@/components/PageTransition';
import AnimatedSection from '@/components/AnimatedSection';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { products, categories } from '@/data/products';

const Catalogue = () => {
  const { language, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    if (categoryId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', categoryId);
    }
    setSearchParams(searchParams);
  };

  const allCategories = [
    { id: 'all', nameAr: 'الكل', nameFr: 'Tout' },
    ...categories,
  ];

  const title = language === 'ar'
    ? 'الكتالوج | كلاسيمو'
    : 'Catalogue | Classimo';

  const description = language === 'ar'
    ? 'تصفح مجموعتنا الكاملة من كوستيم الأفراح'
    : 'Parcourez notre collection complète de costumes de mariage';

  return (
    <PageTransition>
      <Helmet>
        <html lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} />
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>

      <main className="min-h-screen bg-background">
        <Navbar />

        <div className="pt-24 pb-20">
          <div className="container mx-auto px-4">
            {/* Header */}
            <AnimatedSection className="text-center mb-12">
              <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${language === 'ar' ? 'font-arabic' : 'font-display'}`}>
                <span className="text-gradient-gold">{t('nav.catalogue')}</span>
              </h1>
            </AnimatedSection>

            {/* Filters */}
            <AnimatedSection delay={0.1} className="flex flex-wrap justify-center gap-2 mb-12">
              {allCategories.map((cat) => (
                <motion.div
                  key={cat.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={activeCategory === cat.id ? 'gold' : 'premium'}
                    size="sm"
                    onClick={() => handleCategoryChange(cat.id)}
                    className="transition-all duration-300"
                  >
                    {language === 'ar' ? cat.nameAr : cat.nameFr}
                  </Button>
                </motion.div>
              ))}
            </AnimatedSection>

            {/* Products Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                  >
                    <ProductCard {...product} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="text-muted-foreground">
                  {language === 'ar' ? 'لا توجد منتجات' : 'Aucun produit trouvé'}
                </p>
              </motion.div>
            )}
          </div>
        </div>

        <Footer />
      </main>
    </PageTransition>
  );
};

export default Catalogue;
