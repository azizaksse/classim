import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';

const allProducts = [
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
  {
    id: '5',
    nameAr: 'شو أبيض فاخر',
    nameFr: 'Show Blanc Luxe',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800',
    ],
    rentPrice: 12000,
    salePrice: 55000,
    sizes: ['M', 'L'],
    category: 'show',
  },
  {
    id: '6',
    nameAr: 'شو ذهبي',
    nameFr: 'Show Doré',
    images: [
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800',
      'https://images.unsplash.com/photo-1598808503746-f34c53b9323e?q=80&w=800',
    ],
    rentPrice: 15000,
    salePrice: 65000,
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'show',
  },
  {
    id: '7',
    nameAr: 'تيشيرت أسود كلاسيك',
    nameFr: 'T-shirt Noir Classic',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=800',
    ],
    rentPrice: 2000,
    salePrice: 8000,
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'tshirts',
  },
  {
    id: '8',
    nameAr: 'ربطة عنق حريرية',
    nameFr: 'Cravate en Soie',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800',
      'https://images.unsplash.com/photo-1589756823695-278bc923f962?q=80&w=800',
    ],
    rentPrice: 1500,
    salePrice: 5000,
    sizes: ['Unique'],
    category: 'accessories',
  },
];

const categories = [
  { id: 'all', nameAr: 'الكل', nameFr: 'Tout' },
  { id: 'costumes', nameAr: 'كوستيم', nameFr: 'Costumes' },
  { id: 'show', nameAr: 'شو', nameFr: 'Show' },
  { id: 'tshirts', nameAr: 'تيشيرت', nameFr: 'T-shirts' },
  { id: 'accessories', nameAr: 'إكسسوارات', nameFr: 'Accessoires' },
];

const Catalogue = () => {
  const { language, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');

  const filteredProducts = activeCategory === 'all'
    ? allProducts
    : allProducts.filter(p => p.category === activeCategory);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    if (categoryId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', categoryId);
    }
    setSearchParams(searchParams);
  };

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
              {categories.map((cat) => (
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
