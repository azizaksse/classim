import { CheckCircle2, Copy, MessageCircle, PhoneCall, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type ThankYouState = {
  productName?: string;
};

const whatsappNumber = "213795443714";

const ThankYou = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const location = useLocation();
  const state = (location.state || {}) as ThankYouState;
  const whatsappDisplay = "+213 795 44 37 14";

  const heading =
    language === "ar" ? "تم استلام طلبك بنجاح" : "Votre commande est bien reçue";
  const subheading =
    language === "ar"
      ? "سنتصل بك لتأكيد الطلبية في أقرب وقت."
      : "Nous vous appellerons très bientôt pour confirmer votre commande.";
  const productLine = state.productName
    ? language === "ar"
      ? `المنتج: ${state.productName}`
      : `Produit: ${state.productName}`
    : null;

  const copyWhatsApp = async () => {
    try {
      await navigator.clipboard.writeText(whatsappDisplay);
      toast({
        title: language === "ar" ? "تم نسخ رقم واتساب" : "Numéro WhatsApp copié",
      });
    } catch {
      toast({
        title: language === "ar" ? "تعذر النسخ" : "Copie impossible",
        variant: "destructive",
      });
    }
  };

  return (
    <main
      dir={language === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-gradient-to-b from-background via-secondary/40 to-background px-4 py-10"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl" />
          <CheckCircle2 className="relative h-20 w-20 text-primary animate-scale-in" />
        </div>

        <section className="glass-card w-full rounded-3xl p-6 sm:p-10 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-3">
            {heading}
          </h1>
          <p className="text-center text-muted-foreground text-base sm:text-lg mb-4">
            {subheading}
          </p>

          {productLine ? (
            <div className="mx-auto mb-6 w-fit rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              {productLine}
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-3 mb-8">
            <div className="rounded-xl border border-border/60 bg-card/70 p-4 text-center">
              <PhoneCall className="mx-auto mb-2 h-5 w-5 text-primary" />
              <p className="text-sm font-medium">
                {language === "ar" ? "تأكيد هاتفي" : "Confirmation par appel"}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/70 p-4 text-center">
              <ShoppingBag className="mx-auto mb-2 h-5 w-5 text-primary" />
              <p className="text-sm font-medium">
                {language === "ar" ? "دفع عند الاستلام" : "Paiement à la livraison"}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/70 p-4 text-center">
              <MessageCircle className="mx-auto mb-2 h-5 w-5 text-primary" />
              <p className="text-sm font-medium">
                {language === "ar" ? "دعم عبر واتساب" : "Support via WhatsApp"}
              </p>
            </div>
          </div>

          <div className="mb-8 rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 to-transparent p-4 sm:p-5">
            <p className="mb-3 text-sm font-semibold">
              {language === "ar" ? "خانة واتساب" : "Champ WhatsApp"}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input value={whatsappDisplay} readOnly className="bg-card/80" />
              <Button variant="outline" onClick={copyWhatsApp}>
                <Copy className="h-4 w-4" />
                {language === "ar" ? "نسخ" : "Copier"}
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild variant="whatsapp" size="lg">
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="h-5 w-5" />
                {language === "ar" ? "واتساب الدعم" : "WhatsApp Support"}
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/catalogue">
                {language === "ar" ? "مواصلة التسوق" : "Continuer vos achats"}
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ThankYou;
