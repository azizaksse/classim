import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
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
    <>
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
            <div className="text-center mb-12">
              <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${language === 'ar' ? 'font-arabic' : 'font-display'}`}>
                <span className="text-gradient-gold">{t('nav.catalogue')}</span>
              </h1>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {allCategories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={activeCategory === cat.id ? 'gold' : 'premium'}
                  size="sm"
                  onClick={() => handleCategoryChange(cat.id)}
                >
                  {language === 'ar' ? cat.nameAr : cat.nameFr}
                </Button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ProductCard {...product} />
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground">
                  {language === 'ar' ? 'لا توجد منتجات' : 'Aucun produit trouvé'}
                </p>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
};

export default Catalogue;
