import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import PageTransition from '@/components/PageTransition';
import AnimatedSection from '@/components/AnimatedSection';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DeferredSection from '@/components/DeferredSection';
import LeadForm from '@/components/LeadForm';
import { Button } from '@/components/ui/button';
import { Truck, CreditCard, ArrowLeft, ArrowRight } from 'lucide-react';
import { useStoreProducts } from '@/hooks/useStoreProducts';
const SizeCalculator = lazy(() => import('@/components/SizeCalculator'));

const ProductDetail = () => {
  const { id } = useParams();
  const { language, t, dir } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const { products, isLoading } = useStoreProducts();
  const product = products.find(p => p.id === id);

  if (!product && !isLoading) {
    return (
      <>
        <Navbar />
        <PageTransition>
          <main className="min-h-screen bg-background">
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
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <PageTransition>
          <main className="min-h-screen bg-background">
            <div className="pt-32 pb-20 text-center">
              <h1 className="text-2xl text-muted-foreground">
                {language === 'ar' ? 'جاري التحميل...' : 'Chargement...'}
              </h1>
            </div>
            <Footer />
          </main>
        </PageTransition>
      </>
    );
  }

  const productName = language === 'ar' ? product.nameAr : product.nameFr;
  const productDescription = language === 'ar' ? product.descriptionAr : product.descriptionFr;
  const images = useMemo(
    () => (Array.isArray(product.images) && product.images.length ? product.images : ["/placeholder.svg"]),
    [product.images]
  );
  const sizes = useMemo(() => (Array.isArray(product.sizes) ? product.sizes : []), [product.sizes]);
  const colors = useMemo(() => (Array.isArray(product.colors) ? product.colors : []), [product.colors]);

  useEffect(() => {
    if (selectedImage >= images.length) {
      setSelectedImage(0);
    }
  }, [images.length, selectedImage]);

  return (
    <>
      <Navbar />
      <PageTransition>
        <Helmet>
          <html lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} />
          <title>{productName} | Classimo</title>
          <meta name="description" content={productDescription} />
        </Helmet>

        <main className="min-h-screen bg-background">
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
                        src={images[selectedImage]}
                        alt={productName}
                        className="w-full h-full object-cover"
                        loading="eager"
                        decoding="async"
                        fetchPriority="high"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    </AnimatePresence>
                  </motion.div>

                  {/* Thumbnails */}
                  {images.length > 1 && (
                    <div className="flex gap-3">
                      {images.map((img, index) => (
                        <motion.button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`w-20 h-24 rounded-lg overflow-hidden border-2 transition-colors ${
                            selectedImage === index ? 'border-primary' : 'border-transparent'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <img
                            src={img}
                            alt=""
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                            width={80}
                            height={96}
                          />
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
                        {language === 'ar' ? 'السعر' : 'Prix'}
                      </span>
                      {product.salePercentage && product.salePercentage > 0 && product.originalPrice && product.originalPrice > product.rentPrice && (
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-sm line-through text-muted-foreground">
                            {product.originalPrice.toLocaleString()} {language === 'ar' ? 'دج' : 'DA'}
                          </span>
                          <span className="rounded bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive">
                            -{product.salePercentage}%
                          </span>
                        </div>
                      )}
                      <div className="mt-2 text-sm font-medium">
                        {product.inStock
                          ? (language === 'ar' ? `متوفر في المخزون (${product.stock})` : `In stock (${product.stock})`)
                          : (language === 'ar' ? 'غير متوفر في المخزون' : 'Out of stock')}
                      </div>
                    </div>
                  </div>

                  {/* Sizes */}
                  <div>
                    <h3 className="font-medium text-foreground mb-3">{t('product.sizes')}</h3>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size) => (
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

                  {/* Colors */}
                  {colors.length > 0 && (
                    <div>
                      <h3 className="font-medium text-foreground mb-3">
                        {language === 'ar' ? 'الألوان المتوفرة' : 'Couleurs disponibles'}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {colors.map((color) => (
                          <motion.button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-4 py-2 rounded-lg border transition-colors ${
                              selectedColor === color
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-secondary border-border hover:border-primary text-foreground'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {color}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity */}
                  <div>
                    <h3 className="font-medium text-foreground mb-3">
                      {language === 'ar' ? 'الكمية' : 'Quantite'}
                    </h3>
                    <div className="inline-flex items-center rounded-lg border border-border bg-secondary">
                      <button
                        type="button"
                        className="px-3 py-2 text-lg"
                        onClick={() => setSelectedQuantity((q) => Math.max(1, q - 1))}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 min-w-[48px] text-center font-semibold">
                        {selectedQuantity}
                      </span>
                      <button
                        type="button"
                        className="px-3 py-2 text-lg"
                        onClick={() => setSelectedQuantity((q) => Math.min(10, q + 1))}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
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
                    unitPrice={product.rentPrice}
                    selectedSize={selectedSize} 
                    selectedColor={selectedColor}
                    selectedQuantity={selectedQuantity}
                  />
                </AnimatedSection>
              </div>

              {/* Size Calculator */}
              <div className="mt-20">
                <DeferredSection minHeight={520}>
                  <Suspense fallback={<div className="min-h-[520px]" />}>
                    <SizeCalculator />
                  </Suspense>
                </DeferredSection>
              </div>
            </div>
          </div>

          <Footer />
        </main>
      </PageTransition>
    </>
  );
};

export default ProductDetail;
