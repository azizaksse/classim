import { useLanguage } from '@/contexts/LanguageContext';
import { Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

const instagramPosts = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600',
    likes: 234,
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600',
    likes: 189,
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=600',
    likes: 312,
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600',
    likes: 156,
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1598808503746-f34c53b9323e?q=80&w=600',
    likes: 278,
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?q=80&w=600',
    likes: 203,
  },
];

const InstagramFeed = () => {
  const { language } = useLanguage();

  const instagramHandle = '@classimo'; // Replace with your actual handle
  const instagramUrl = 'https://instagram.com/classimo'; // Replace with your actual URL

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
          {instagramPosts.map((post, index) => (
            <a
              key={post.id}
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-lg animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={post.image}
                alt={`Instagram post ${post.id}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="flex items-center gap-2 text-foreground">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <span className="font-semibold">{post.likes}</span>
                </div>
              </div>
              {/* Instagram gradient border on hover */}
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
                style={{ 
                  boxShadow: 'inset 0 0 0 2px transparent',
                  background: 'linear-gradient(45deg, #f9ce34, #ee2a7b, #6228d7) border-box',
                  WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  padding: '2px',
                }}
              />
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
