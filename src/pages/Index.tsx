import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';
import PageTransition from '@/components/PageTransition';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TrustBadges from '@/components/TrustBadges';
import SizeCalculator from '@/components/SizeCalculator';
import Categories from '@/components/Categories';
import FeaturedProducts from '@/components/FeaturedProducts';
import Testimonials from '@/components/Testimonials';
import InstagramFeed from '@/components/InstagramFeed';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

const Index = () => {
  const { language } = useLanguage();

  const title = language === 'ar' 
    ? 'كلاسيمو | كراء و بيع كوستيم الأفراح في الجزائر' 
    : 'Classimo | Location & Vente de Costumes de Mariage en Algérie';
  
  const description = language === 'ar'
    ? 'موديلات فاخرة من كوستيم الأفراح للكراء والبيع. توصيل لكل ولايات الجزائر. دفع عند الاستلام.'
    : 'Modèles premium de costumes de mariage en location et vente. Livraison nationale en Algérie. Paiement à la livraison.';

  return (
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
        <Navbar />
        <Hero />
        <TrustBadges />
        <SizeCalculator />
        <Categories />
        <FeaturedProducts />
        <Testimonials />
        <InstagramFeed />
        <CTASection />
        <Footer />
      </main>
    </PageTransition>
  );
};

export default Index;
