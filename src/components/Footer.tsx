import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle, Instagram, Phone } from 'lucide-react';

const Footer = () => {
  const { t, language } = useLanguage();

  const whatsappNumber = '213XXXXXXXXX';

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <span className={`text-2xl font-bold text-gradient-gold ${language === 'ar' ? 'font-arabic' : 'font-display'}`}>
                {language === 'ar' ? 'كلاسيمو' : 'Classimo'}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`font-semibold mb-4 text-foreground ${language === 'ar' ? 'font-arabic' : 'font-display'}`}>
              {language === 'ar' ? 'روابط سريعة' : 'Liens rapides'}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/catalogue" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.catalogue')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className={`font-semibold mb-4 text-foreground ${language === 'ar' ? 'font-arabic' : 'font-display'}`}>
              {t('nav.contact')}
            </h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a 
                  href={`tel:+${whatsappNumber}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  +213 XX XX XX XX
                </a>
              </li>
              <li>
                <a 
                  href="https://instagram.com/classimo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  @classimo
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {t('footer.brand')}. {t('footer.rights')}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
