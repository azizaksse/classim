import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const TrackingSection = () => {
    const { language } = useLanguage();
    const isRtl = language === 'ar';

    const items = [
        {
            id: "home",
            label: { en: "Home", ar: "الرئيسية", fr: "Accueil" },
            href: "#"
        },
        {
            id: "category",
            label: { en: "Category", ar: "الأصناف", fr: "Catégories" },
            href: "#catalogue"
        },
        {
            id: "contact",
            label: { en: "Contact Us", ar: "اتصل بنا", fr: "Contactez-nous" },
            href: "#contact"
        },
    ];

    return (
        <div className={`fixed top-1/2 -translate-y-1/2 z-[100] hidden md:flex flex-col gap-8 ${isRtl ? 'right-6 md:right-12' : 'left-6 md:left-12'}`}>
            {items.map((item, index) => (
                <motion.a
                    key={item.id}
                    href={item.href}
                    initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className={`group flex items-center gap-4 cursor-pointer ${isRtl ? 'flex-row-reverse' : ''}`}
                >
                    {/* The Dash - Exactly like the image */}
                    <div className="w-6 md:w-8 h-[1px] bg-foreground/30 group-hover:w-12 group-hover:bg-primary transition-all duration-500 ease-in-out" />

                    {/* The Label - Clean typography */}
                    <span className={`text-base md:text-lg font-medium transition-colors duration-300 tracking-wide ${language === 'ar' ? 'font-arabic' : 'font-display'} text-foreground/60 group-hover:text-foreground`}>
                        {item.label[language as keyof typeof item.label] || item.label.en}
                    </span>
                </motion.a>
            ))}
        </div>
    );
};

export default TrackingSection;
