import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, X, Globe, MessageCircle, Settings } from 'lucide-react';
import logo from '@/assets/logo.jpg';

const Navbar = () => {
  const { language, setLanguage, t, dir } = useLanguage();
  const { isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navLinks = [
    { key: 'nav.home', path: '/' },
    { key: 'nav.catalogue', path: '/catalogue' },
    { key: 'nav.contact', path: '/contact' },
  ];

  const whatsappNumber = '213795443714';
  const whatsappMessage = encodeURIComponent(
    language === 'ar' 
      ? 'السلام عليكم، نحب نحجز كوستيم' 
      : 'Bonjour, je souhaite réserver un costume'
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'fr' : 'ar');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav 
      className="fixed top-3 md:top-4 inset-x-0 z-50 px-3 md:px-4"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div
        className={`mx-auto w-full max-w-4xl transition-all duration-500 ${
          scrolled 
            ? 'bg-card/95 shadow-elegant border border-border/60' 
            : 'bg-card/80 border border-border/40'
        } backdrop-blur-xl rounded-2xl`}
      >
        <div className="px-4 md:px-6">
        <div className="grid grid-cols-3 items-center h-14 md:h-16">
          {/* Actions - Left in LTR, Right in RTL */}
          <div className="flex items-center gap-2 md:gap-3 justify-start">
            {/* WhatsApp CTA - Desktop */}
            <motion.a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 bg-whatsapp hover:bg-whatsapp-hover text-primary-foreground px-3 md:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden lg:inline">{language === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
            </motion.a>

            {/* Language Toggle */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-xl px-3"
              >
                <Globe className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase">
                  {language === 'ar' ? 'FR' : 'عربي'}
                </span>
              </Button>
            </motion.div>
          </div>

          {/* Logo - Center */}
          <Link to="/" className="flex items-center justify-center gap-2 md:gap-3 group">
            <motion.div 
              className={`w-9 h-9 md:w-11 md:h-11 rounded-full overflow-hidden border-2 transition-all duration-300 ${
                scrolled ? 'border-primary' : 'border-primary/60'
              } group-hover:border-primary group-hover:shadow-gold`}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <img src={logo} alt="Classimo Logo" className="w-full h-full object-cover" />
            </motion.div>
            <span className={`hidden sm:block text-lg md:text-xl font-bold text-gradient-gold ${dir === 'rtl' ? 'font-arabic' : 'font-display'}`}>
              {language === 'ar' ? 'كلاسيمو' : 'Classimo'}
            </span>
          </Link>

          {/* Desktop Navigation - Right in LTR, Left in RTL */}
          <div className="hidden md:flex items-center justify-end gap-1 bg-secondary/50 rounded-xl p-1 w-fit ms-auto">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                to={link.path}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive(link.path)
                    ? 'text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {isActive(link.path) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-primary shadow-gold rounded-lg"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{t(link.key)}</span>
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
                  location.pathname.startsWith('/admin')
                    ? 'text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {location.pathname.startsWith('/admin') && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-primary shadow-gold rounded-lg"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Settings className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Admin</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle - shown instead of nav on mobile */}
          <div className="md:hidden flex justify-end">

            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-secondary/80 rounded-xl"
                onClick={() => setIsOpen(!isOpen)}
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-2 py-4 border-t border-border/30">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 rounded-xl transition-all duration-300 text-center font-medium ${
                        isActive(link.path)
                          ? 'bg-primary text-primary-foreground shadow-gold'
                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                      }`}
                    >
                      {t(link.key)}
                    </Link>
                  </motion.div>
                ))}
                
                {/* Admin Link - Mobile */}
                {isAdmin && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.1 }}
                  >
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                        location.pathname.startsWith('/admin')
                          ? 'bg-primary text-primary-foreground shadow-gold'
                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                      }`}
                    >
                      <Settings className="w-5 h-5" />
                      Admin
                    </Link>
                  </motion.div>
                )}
                
                {/* WhatsApp CTA - Mobile */}
                <motion.a
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 bg-whatsapp hover:bg-whatsapp-hover text-primary-foreground px-4 py-3 rounded-xl font-medium transition-all duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <MessageCircle className="w-5 h-5" />
                  {language === 'ar' ? 'تواصل عبر واتساب' : 'Contacter via WhatsApp'}
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </motion.nav>
  );
};

export default Navbar;
