import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface ProductCardProps {
  id: string;
  nameAr: string;
  nameFr: string;
  images: string[];
  rentPrice: number;
  salePrice?: number;
  sizes: string[];
  category: string;
}

const ProductCard = ({ id, nameAr, nameFr, images, rentPrice, salePrice, sizes }: ProductCardProps) => {
  const { language, t } = useLanguage();

  const whatsappNumber = '213795443714';
  const productName = language === 'ar' ? nameAr : nameFr;
  const message = language === 'ar'
    ? `السلام عليكم، أريد الاستفسار عن: ${productName}`
    : `Bonjour, je voudrais des informations sur: ${productName}`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.div 
      className="group glass-card rounded-xl overflow-hidden"
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      {/* Image */}
      <Link to={`/product/${id}`} className="block relative aspect-[3/4] overflow-hidden">
        <motion.img
          src={images[0]}
          alt={productName}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
        />
        {/* Second image on hover */}
        {images[1] && (
          <img
            src={images[1]}
            alt={productName}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Name */}
        <Link to={`/product/${id}`}>
          <h3 className={`font-semibold text-foreground mb-2 hover:text-primary transition-colors ${language === 'ar' ? 'font-arabic' : 'font-display'}`}>
            {productName}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-primary font-bold">
            {rentPrice.toLocaleString()} {language === 'ar' ? 'دج' : 'DA'}
          </span>
          <span className="text-xs text-muted-foreground">
            / {t('product.rent')}
          </span>
          {salePrice && (
            <>
              <span className="text-muted-foreground">•</span>
              <span className="text-foreground font-medium">
                {salePrice.toLocaleString()} {language === 'ar' ? 'دج' : 'DA'}
              </span>
              <span className="text-xs text-muted-foreground">
                / {t('product.sale')}
              </span>
            </>
          )}
        </div>

        {/* Sizes */}
        <div className="flex flex-wrap gap-1 mb-4">
          {sizes.slice(0, 4).map((size) => (
            <motion.span
              key={size}
              className="px-2 py-0.5 text-xs rounded bg-secondary text-secondary-foreground"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              {size}
            </motion.span>
          ))}
          {sizes.length > 4 && (
            <span className="px-2 py-0.5 text-xs rounded bg-secondary text-secondary-foreground">
              +{sizes.length - 4}
            </span>
          )}
        </div>

        {/* CTA */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="whatsapp"
            size="sm"
            className="w-full"
            asChild
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-4 h-4" />
              {t('product.cta')}
            </a>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
