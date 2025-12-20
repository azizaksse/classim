import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import PageTransition from '@/components/PageTransition';
import AnimatedSection from '@/components/AnimatedSection';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SizeCalculator from '@/components/SizeCalculator';
import LeadForm from '@/components/LeadForm';
import { Button } from '@/components/ui/button';
import { Truck, CreditCard, ArrowLeft, ArrowRight } from 'lucide-react';
import { products } from '@/data/products';

const ProductDetail = () => {
  const { id } = useParams();
  const { language, t, dir } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <PageTransition>
        <main className="min-h-screen bg-background">
          <Navbar />
          <div className="pt-32 pb-20 text-center">
            <h1 className="text-2xl text-muted-foreground">
              {language === 'ar' ? 'المنتج غير موجود' : 'Produit non trouvé'}
            </h1>
            <Button variant="goldOutline" asChild className="mt-4">
              <Link to="/catalogue">
                {dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                {t('nav.catalogue')}
              </Link>
            </Button>
          </div>
          <Footer />
        </main>
      </PageTransition>
    );
  }

  const productName = language === 'ar' ? product.nameAr : product.nameFr;
  const productDescription = language === 'ar' ? product.descriptionAr : product.descriptionFr;

  return (
    <PageTransition>
      <Helmet>
        <html lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} />
        <title>{productName} | Classimo</title>
        <meta name="description" content={productDescription} />
      </Helmet>

      <main className="min-h-screen bg-background">
        <Navbar />

        <div className="pt-24 pb-20">
          <div className="container mx-auto px-4">
            {/* Breadcrumb */}
            <AnimatedSection className="mb-8">
              <Link 
                to="/catalogue" 
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                {t('nav.catalogue')}
              </Link>
            </AnimatedSection>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Images */}
              <AnimatedSection direction="left" className="space-y-4">
                {/* Main Image */}
                <motion.div 
                  className="aspect-[3/4] rounded-2xl overflow-hidden bg-card"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={selectedImage}
                      src={product.images[selectedImage]}
                      alt={productName}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </AnimatePresence>
                </motion.div>

                {/* Thumbnails */}
                {product.images.length > 1 && (
                  <div className="flex gap-3">
                    {product.images.map((img, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`w-20 h-24 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImage === index ? 'border-primary' : 'border-transparent'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </motion.button>
                    ))}
                  </div>
                )}
              </AnimatedSection>

              {/* Details */}
              <AnimatedSection direction="right" className="space-y-6">
                {/* Name */}
                <h1 className={`text-3xl md:text-4xl font-bold text-foreground ${language === 'ar' ? 'font-arabic' : 'font-display'}`}>
                  {productName}
                </h1>

                {/* Description */}
                <p className="text-muted-foreground">
                  {productDescription}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-4 py-4 border-y border-border">
                  <div>
                    <span className="text-3xl font-bold text-gradient-gold">
                      {product.rentPrice.toLocaleString()} {language === 'ar' ? 'دج' : 'DA'}
                    </span>
                    <span className="text-sm text-muted-foreground ms-2">
                      / {t('product.rent')}
                    </span>
                  </div>
                  {product.salePrice && (
                    <div>
                      <span className="text-2xl font-semibold text-foreground">
                        {product.salePrice.toLocaleString()} {language === 'ar' ? 'دج' : 'DA'}
                      </span>
                      <span className="text-sm text-muted-foreground ms-2">
                        / {t('product.sale')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Sizes */}
                <div>
                  <h3 className="font-medium text-foreground mb-3">{t('product.sizes')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <motion.button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          selectedSize === size
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-secondary border-border hover:border-primary text-foreground'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap gap-4 py-4">
                  <motion.div 
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Truck className="w-4 h-4 text-primary" />
                    {t('product.delivery')}
                  </motion.div>
                  <motion.div 
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <CreditCard className="w-4 h-4 text-primary" />
                    {t('product.cod')}
                  </motion.div>
                </div>

                {/* Lead Form */}
                <LeadForm 
                  productName={productName} 
                  selectedSize={selectedSize} 
                />
              </AnimatedSection>
            </div>

            {/* Size Calculator */}
            <div className="mt-20">
              <SizeCalculator />
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </PageTransition>
  );
};

export default ProductDetail;
