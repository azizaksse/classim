import atlasVelvet from '@/assets/products/atlas-velvet.jpg';
import constantinClassic from '@/assets/products/constantine-classic.jpg';
import noirEtoile from '@/assets/products/noir-etoile.jpg';
import oranSand from '@/assets/products/oran-sand.jpg';
import saharLuxe from '@/assets/products/sahar-luxe.jpg';
import gallery1 from '@/assets/products/gallery-1.jpg';
import gallery2 from '@/assets/products/gallery-2.jpg';
import gallery3 from '@/assets/products/gallery-3.jpg';
import gallery4 from '@/assets/products/gallery-4.jpg';
import gallery5 from '@/assets/products/gallery-5.jpg';
import oxfordNoir from '@/assets/products/oxford-noir.jpg';
import derbyMarron from '@/assets/products/derby-marron.jpg';

export const products = [
  {
    id: '1',
    nameAr: 'أطلس فيلفت',
    nameFr: 'Atlas Velvet',
    descriptionAr: 'كوستيم أزرق مخطط دبل بريست بتصميم إيطالي فاخر. قماش فاخر مع خطوط رفيعة أنيقة.',
    descriptionFr: 'Costume bleu rayé double-breasted au design italien luxueux. Tissu premium avec fines rayures élégantes.',
    images: [atlasVelvet, gallery2],
    rentPrice: 9000,
    salePrice: 42000,
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'costumes',
  },
  {
    id: '2',
    nameAr: 'قسنطينة كلاسيك',
    nameFr: 'Constantine Classic',
    descriptionAr: 'كوستيم أزرق ملكي دبل بريست مع أزرار ذهبية. تصميم كلاسيكي فاخر مع ربطة عنق ذهبية.',
    descriptionFr: 'Costume bleu royal double-breasted avec boutons dorés. Design classique luxueux avec cravate dorée.',
    images: [constantinClassic, gallery4],
    rentPrice: 10000,
    salePrice: 48000,
    sizes: ['M', 'L', 'XL'],
    category: 'costumes',
  },
  {
    id: '3',
    nameAr: 'نوار إيتوال',
    nameFr: 'Noir Étoile',
    descriptionAr: 'طقم فاخر أبيض مع برنوس أسود مطرز بالذهب. تصميم ملكي للعرسان المميزين.',
    descriptionFr: 'Ensemble blanc luxueux avec cape noire brodée en or. Design royal pour les mariés distingués.',
    images: [noirEtoile, gallery5],
    rentPrice: 15000,
    salePrice: 75000,
    sizes: ['M', 'L', 'XL'],
    category: 'costumes',
  },
  {
    id: '4',
    nameAr: 'وهران ساند',
    nameFr: 'Oran Sand',
    descriptionAr: 'كوستيم بيج فاخر ثلاث قطع مع ياقة سوداء. أناقة عصرية مع لمسة كلاسيكية.',
    descriptionFr: 'Costume beige luxueux trois pièces avec col noir. Élégance moderne avec touche classique.',
    images: [oranSand, gallery1],
    rentPrice: 11000,
    salePrice: 52000,
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'costumes',
  },
  {
    id: '5',
    nameAr: 'سهر لوكس',
    nameFr: 'Sahar Luxe',
    descriptionAr: 'سموكينغ أسود كلاسيكي ثلاث قطع. التصميم الأنيق المثالي للمناسبات الرسمية.',
    descriptionFr: 'Smoking noir classique trois pièces. Le design élégant parfait pour les occasions formelles.',
    images: [saharLuxe, gallery1],
    rentPrice: 12000,
    salePrice: 55000,
    sizes: ['46', '48', '50', '52', '54', '56'],
    category: 'costumes',
  },
  {
    id: '6',
    nameAr: 'فوغ سمر',
    nameFr: 'Vogue Summer',
    descriptionAr: 'كوستيم أسود أنيق مع قميص أسود وبابيون. إطلالة عصرية للرجل الأنيق.',
    descriptionFr: 'Costume noir élégant avec chemise noire et nœud papillon. Look moderne pour homme élégant.',
    images: [gallery1, saharLuxe],
    rentPrice: 10000,
    salePrice: 45000,
    sizes: ['M', 'L', 'XL'],
    category: 'costumes',
  },
  {
    id: '7',
    nameAr: 'إميرالد رويال',
    nameFr: 'Emerald Royal',
    descriptionAr: 'كوستيم أخضر زمردي ثلاث قطع مع أزرار ذهبية. لون فريد لإطلالة مميزة.',
    descriptionFr: 'Costume vert émeraude trois pièces avec boutons dorés. Couleur unique pour un look distinctif.',
    images: [gallery3, constantinClassic],
    rentPrice: 11000,
    salePrice: 50000,
    sizes: ['M', 'L', 'XL'],
    category: 'costumes',
  },
  {
    id: '8',
    nameAr: 'الأمير الأزرق',
    nameFr: 'Prince Bleu',
    descriptionAr: 'كوستيم أزرق ملكي مع برنوس مطرز بالذهب. تصميم تقليدي فاخر للأعراس الجزائرية.',
    descriptionFr: 'Costume bleu royal avec cape brodée en or. Design traditionnel luxueux pour mariages algériens.',
    images: [gallery4, noirEtoile],
    rentPrice: 14000,
    salePrice: 68000,
    sizes: ['M', 'L', 'XL'],
    category: 'costumes',
  },
  {
    id: '9',
    nameAr: 'حذاء أكسفورد أسود',
    nameFr: 'Oxford Noir',
    descriptionAr: 'حذاء أكسفورد كلاسيكي من الجلد الطبيعي. مثالي للمناسبات الرسمية والأعراس.',
    descriptionFr: 'Chaussure Oxford classique en cuir véritable. Parfait pour les occasions formelles et mariages.',
    images: [oxfordNoir, gallery1],
    rentPrice: 3000,
    salePrice: 18000,
    sizes: ['40', '41', '42', '43', '44', '45'],
    category: 'shoes',
  },
  {
    id: '10',
    nameAr: 'حذاء دربي بني',
    nameFr: 'Derby Marron',
    descriptionAr: 'حذاء دربي أنيق بني من الجلد الفاخر. تصميم إيطالي راقي.',
    descriptionFr: 'Chaussure Derby élégante marron en cuir premium. Design italien raffiné.',
    images: [derbyMarron, oxfordNoir],
    rentPrice: 3500,
    salePrice: 20000,
    sizes: ['40', '41', '42', '43', '44', '45'],
    category: 'shoes',
  },
];

export const categories = [
  {
    id: 'costumes',
    nameAr: 'كوستيم',
    nameFr: 'Costumes',
    image: atlasVelvet,
    count: 6,
  },
  {
    id: 'shoes',
    nameAr: 'أحذية',
    nameFr: 'Chaussures',
    image: oxfordNoir,
    count: 2,
  },
  {
    id: 'tshirts',
    nameAr: 'تيشيرت',
    nameFr: 'T-shirts',
    image: gallery1,
    count: 8,
  },
  {
    id: 'accessories',
    nameAr: 'إكسسوارات',
    nameFr: 'Accessoires',
    image: gallery3,
    count: 15,
  },
];

export const instagramImages = [
  gallery1,
  atlasVelvet,
  noirEtoile,
  gallery3,
  oranSand,
  gallery5,
];
