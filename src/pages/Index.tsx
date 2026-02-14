import { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';
import PageTransition from '@/components/PageTransition';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import DeferredSection from '@/components/DeferredSection';
import Footer from '@/components/Footer';
const TrustBadges = lazy(() => import('@/components/TrustBadges'));
const FeaturedProducts = lazy(() => import('@/components/FeaturedProducts'));
const Categories = lazy(() => import('@/components/Categories'));
const SizeCalculator = lazy(() => import('@/components/SizeCalculator'));
const Testimonials = lazy(() => import('@/components/Testimonials'));
const InstagramFeed = lazy(() => import('@/components/InstagramFeed'));
const CTASection = lazy(() => import('@/components/CTASection'));

const Index = () => {
  const { language } = useLanguage();

  const title = language === 'ar'
    ? 'كلاسيمو | كراء و بيع كوستيم الأفراح في الجزائر'
    : 'Classimo | Location & Vente de Costumes de Mariage en Algérie';

  const description = language === 'ar'
    ? 'موديلات فاخرة من كوستيم الأفراح للكراء والبيع. توصيل لكل ولايات الجزائر. دفع عند الاستلام.'
    : 'Modèles premium de costumes de mariage en location et vente. Livraison nationale en Algérie. Paiement à la livraison.';

  return (
    <>
      <Navbar />
      <PageTransition>
        <Helmet>
          <html lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} />
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
        </Helmet>

        <main className="min-h-screen bg-background">
          <Hero />
          <DeferredSection minHeight={220}>
            <Suspense fallback={<div className="min-h-[220px]" />}>
              <TrustBadges />
            </Suspense>
          </DeferredSection>
          <DeferredSection minHeight={640}>
            <Suspense fallback={<div className="min-h-[640px]" />}>
              <FeaturedProducts />
            </Suspense>
          </DeferredSection>
          <DeferredSection minHeight={520}>
            <Suspense fallback={<div className="min-h-[520px]" />}>
              <Categories />
            </Suspense>
          </DeferredSection>
          <DeferredSection minHeight={520}>
            <Suspense fallback={<div className="min-h-[520px]" />}>
              <SizeCalculator />
            </Suspense>
          </DeferredSection>
          <DeferredSection minHeight={720}>
            <Suspense fallback={<div className="min-h-[720px]" />}>
              <Testimonials />
            </Suspense>
          </DeferredSection>
          <DeferredSection minHeight={640}>
            <Suspense fallback={<div className="min-h-[640px]" />}>
              <InstagramFeed />
            </Suspense>
          </DeferredSection>
          <DeferredSection minHeight={360}>
            <Suspense fallback={<div className="min-h-[360px]" />}>
              <CTASection />
            </Suspense>
          </DeferredSection>
          <Footer />
        </main>
      </PageTransition>
    </>
  );
};

export default Index;
