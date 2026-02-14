import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ADMIN_PASSWORD = "islamadmin";

const AdminAccess = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password === ADMIN_PASSWORD) {
      navigate("/admin");
      return;
    }

    setError(language === "ar" ? "كلمة المرور غير صحيحة" : "Wrong password");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background px-4 py-10">
      <div className="mx-auto max-w-md">
        <Link
          to="/"
          className="mb-6 inline-block text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          {language === "ar" ? "العودة للصفحة الرئيسية" : "Back to home"}
        </Link>

        <section className="glass-card animate-scale-in rounded-2xl border border-primary/25 p-6 shadow-gold">
          <div className="mb-6 flex items-center justify-center gap-2 text-primary">
            <ShieldCheck className="h-5 w-5" />
            <h1 className={`text-2xl font-bold ${language === "ar" ? "font-arabic" : "font-display"}`}>
              {language === "ar" ? "دخول الإدارة" : "Admin Access"}
            </h1>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block text-sm text-foreground">
              {language === "ar" ? "كلمة المرور" : "Password"}
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                className="h-12 ps-10 input-luxury"
                placeholder={language === "ar" ? "ادخل كلمة المرور" : "Enter password"}
                dir="ltr"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" variant="gold" size="lg" className="w-full">
              {language === "ar" ? "دخول" : "Login"}
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
};

export default AdminAccess;
