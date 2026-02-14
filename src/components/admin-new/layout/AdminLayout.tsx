import { ReactNode, useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Crown, Menu } from "lucide-react";
import { useAdminLanguage } from "@/contexts/AdminLanguageContext";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { language, setLanguage, t, dir } = useAdminLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground" dir={dir}>
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <main
        className={cn(
          "min-h-screen transition-all duration-300 ease-out",
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        )}
      >
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:hidden">
          <div className="flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent">
                <Crown className="h-4 w-4 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold">Classimo</p>
                <p className="text-[11px] text-muted-foreground">{t("admin.panel")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex overflow-hidden rounded-md border border-border">
                <Button
                  variant={language === "fr" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-8 rounded-none px-2"
                  onClick={() => setLanguage("fr")}
                >
                  FR
                </Button>
                <Button
                  variant={language === "ar" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-8 rounded-none px-2"
                  onClick={() => setLanguage("ar")}
                >
                  AR
                </Button>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setMobileSidebarOpen(true)}
                aria-label={t("admin.openMenu")}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        <div className="mx-auto w-full max-w-[1400px] p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
