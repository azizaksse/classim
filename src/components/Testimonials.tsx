import { useLanguage } from '@/contexts/LanguageContext';
import { Star, Quote } from 'lucide-react';
import { useRef, useState } from 'react';

const testimonials = [
  {
    id: '1',
    nameAr: 'محمد بن علي',
    nameFr: 'Mohamed Ben Ali',
    locationAr: 'الجزائر العاصمة',
    locationFr: 'Alger',
    reviewAr: 'خدمة ممتازة وجودة عالية. الكوستيم كان رائعاً وناسبني تماماً. شكراً لفريق كلاسيمو على الاحترافية.',
    reviewFr: "Service excellent et haute qualité. Le costume était magnifique et me convenait parfaitement. Merci à l'équipe Classimo pour le professionnalisme.",
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
  },
  {
    id: '2',
    nameAr: 'أحمد كريم',
    nameFr: 'Ahmed Karim',
    locationAr: 'وهران',
    locationFr: 'Oran',
    reviewAr: 'كراء الكوستيم كان سهل جداً. التوصيل كان في الوقت المحدد والمقاس كان مضبوط. أنصح بهم بشدة.',
    reviewFr: "La location du costume était très facile. La livraison était à l'heure et la taille était parfaite. Je les recommande vivement.",
    rating: 5,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200',
  },
  {
    id: '3',
    nameAr: 'يوسف حمادي',
    nameFr: 'Youssef Hamadi',
    locationAr: 'قسنطينة',
    locationFr: 'Constantine',
    reviewAr: 'تجربة رائعة! الفريق ساعدني في اختيار المقاس المناسب. الكوستيم كان أنيق جداً ليوم زفافي.',
    reviewFr: "Expérience formidable ! L'équipe m'a aidé à choisir la bonne taille. Le costume était très élégant pour mon mariage.",
    rating: 5,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200',
  },
  {
    id: '4',
    nameAr: 'عمر بوزيد',
    nameFr: 'Omar Bouzid',
    locationAr: 'سطيف',
    locationFr: 'Sétif',
    reviewAr: 'أسعار معقولة وجودة ممتازة. الدفع عند الاستلام سهّل الأمور كثيراً. سأتعامل معهم مرة أخرى.',
    reviewFr: "Prix raisonnables et excellente qualité. Le paiement à la livraison a beaucoup facilité les choses. Je referai appel à eux.",
    rating: 4,
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200',
  },
  {
    id: '5',
    nameAr: 'كريم مسعود',
    nameFr: 'Karim Massoud',
    locationAr: 'عنابة',
    locationFr: 'Annaba',
    reviewAr: 'تشكيلة واسعة من الموديلات. اخترت كوستيم أزرق ملكي وكان مذهلاً. خدمة عملاء ممتازة.',
    reviewFr: "Large choix de modèles. J'ai choisi un costume bleu royal et il était magnifique. Excellent service client.",
    rating: 5,
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200',
  },
  {
    id: '6',
    nameAr: 'سمير بلقاسم',
    nameFr: 'Samir Belkacem',
    locationAr: 'تلمسان',
    locationFr: 'Tlemcen',
    reviewAr: 'التوصيل كان سريع جداً. الكوستيم وصل في حالة ممتازة. شكراً كلاسيمو!',
    reviewFr: "La livraison était très rapide. Le costume est arrivé en excellent état. Merci Classimo !",
    rating: 5,
    image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=200',
  },
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? 'fill-primary text-primary'
              : 'fill-muted text-muted'
          }`}
        />
      ))}
    </div>
  );
};

interface TestimonialCardProps {
  testimonial: typeof testimonials[0];
  language: 'ar' | 'fr';
}

const TestimonialCard = ({ testimonial, language }: TestimonialCardProps) => {
  return (
    <div className="glass-card rounded-2xl p-6 min-w-[300px] md:min-w-[350px] relative flex-shrink-0">
      {/* Quote Icon */}
      <div className="absolute top-4 end-4 opacity-10">
        <Quote className="w-10 h-10 text-primary" />
      </div>

      {/* Rating */}
      <div className="mb-4">
        <StarRating rating={testimonial.rating} />
      </div>

      {/* Review Text */}
      <p className="text-foreground text-sm leading-relaxed mb-6 line-clamp-4">
        {language === 'ar' ? testimonial.reviewAr : testimonial.reviewFr}
      </p>

      {/* Customer Info */}
      <div className="flex items-center gap-3 pt-4 border-t border-border/50">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
          <img
            src={testimonial.image}
            alt={language === 'ar' ? testimonial.nameAr : testimonial.nameFr}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h4 className={`font-semibold text-foreground text-sm ${language === 'ar' ? 'font-arabic' : ''}`}>
            {language === 'ar' ? testimonial.nameAr : testimonial.nameFr}
          </h4>
          <p className="text-xs text-muted-foreground">
            {language === 'ar' ? testimonial.locationAr : testimonial.locationFr}
          </p>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const { language } = useLanguage();
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Double the testimonials for seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${language === 'ar' ? 'font-arabic' : 'font-display'}`}>
            <span className="text-gradient-gold">
              {language === 'ar' ? 'آراء زبائننا' : 'Avis de nos clients'}
            </span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {language === 'ar'
              ? 'اكتشف تجارب زبائننا الراضين'
              : 'Découvrez les expériences de nos clients satisfaits'}
          </p>
        </div>
      </div>

      {/* Scrolling Testimonials */}
      <div 
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        {/* Scrolling Container */}
        <div
          ref={scrollRef}
          className={`flex gap-6 ${isPaused ? 'animate-scroll-slow' : 'animate-scroll'}`}
          style={{
            width: 'max-content',
          }}
        >
          {duplicatedTestimonials.map((testimonial, index) => (
            <TestimonialCard
              key={`${testimonial.id}-${index}`}
              testimonial={testimonial}
              language={language}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <p className="text-4xl font-bold text-gradient-gold mb-1">500+</p>
            <p className="text-sm text-muted-foreground">
              {language === 'ar' ? 'زبون راضي' : 'Clients satisfaits'}
            </p>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <p className="text-4xl font-bold text-gradient-gold mb-1">4.9</p>
            <p className="text-sm text-muted-foreground">
              {language === 'ar' ? 'تقييم متوسط' : 'Note moyenne'}
            </p>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <p className="text-4xl font-bold text-gradient-gold mb-1">58</p>
            <p className="text-sm text-muted-foreground">
              {language === 'ar' ? 'ولاية مغطاة' : 'Wilayas couvertes'}
            </p>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <p className="text-4xl font-bold text-gradient-gold mb-1">24h</p>
            <p className="text-sm text-muted-foreground">
              {language === 'ar' ? 'توصيل سريع' : 'Livraison rapide'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
