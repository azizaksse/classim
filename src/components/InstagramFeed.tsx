import { useLanguage } from '@/contexts/LanguageContext';
import { Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { instagramImages } from '@/data/products';

const InstagramFeed = () => {
  const { language } = useLanguage();

  const instagramHandle = '@classimo_';
  const instagramUrl = 'https://www.instagram.com/classimo_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==';

  return (
    <section className="py-20 bg-card/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] p-0.5">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                <Instagram className="w-6 h-6 text-foreground" />
              </div>
            </div>
            <div className="text-start">
              <h2 className={`text-2xl md:text-3xl font-bold text-foreground ${language === 'ar' ? 'font-arabic' : 'font-display'}`}>
                {language === 'ar' ? 'تابعنا على انستغرام' : 'Suivez-nous sur Instagram'}
              </h2>
              <p className="text-primary text-sm font-medium">{instagramHandle}</p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-md mx-auto">
            {language === 'ar' 
              ? 'شاهد أحدث موديلاتنا وإطلالات زبائننا المميزة'
              : 'Découvrez nos derniers modèles et les looks de nos clients'}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4 mb-8">
          {instagramImages.map((image, index) => (
            <a
              key={index}
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-lg animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={image}
                alt={`Instagram post ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Instagram className="w-8 h-8 text-foreground" />
              </div>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            variant="goldOutline"
            size="lg"
            asChild
          >
            <a 
              href={instagramUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Instagram className="w-5 h-5" />
              {language === 'ar' ? 'تابعنا على انستغرام' : 'Suivez-nous sur Instagram'}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;
