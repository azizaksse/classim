import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ShoppingCart,
  Users,
  Settings,
  ChevronLeft,
  Crown,
  LogOut,
  Bell,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminLanguage } from "@/contexts/AdminLanguageContext";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { key: "nav.dashboard", icon: LayoutDashboard, href: "/admin" },
  { key: "nav.products", icon: Package, href: "/admin/products" },
  { key: "nav.categories", icon: FolderOpen, href: "/admin/categories" },
  { key: "nav.orders", icon: ShoppingCart, href: "/admin/orders" },
  { key: "nav.customers", icon: Users, href: "/admin/customers" },
  { key: "nav.settings", icon: Settings, href: "/admin/settings" },
];

interface AdminSidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

export function AdminSidebar({
  mobileOpen,
  onMobileClose,
  collapsed,
  setCollapsed,
}: AdminSidebarProps) {
  const isCollapsed = collapsed && !mobileOpen;
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { language, setLanguage, t, dir } = useAdminLanguage();

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Admin";
  const displayEmail = user?.email || "-";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside
      dir={dir}
      className={cn(
        "fixed left-0 top-0 z-50 h-screen border-r border-border bg-card transition-all duration-300 ease-out",
        "w-72 -translate-x-full lg:translate-x-0",
        mobileOpen && "translate-x-0",
        "lg:z-40",
        isCollapsed ? "lg:w-20" : "lg:w-64"
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <div className={cn("flex items-center gap-3 overflow-hidden", isCollapsed && "justify-center")}>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
              <Crown className="h-5 w-5 text-accent-foreground" />
            </div>
            {!isCollapsed && (
              <div className="animate-fade-in">
                <h1 className="font-heading text-lg font-semibold text-card-foreground">
                  Classimo
                </h1>
                <p className="text-xs text-muted-foreground">{t("admin.panel")}</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileClose}
            className="lg:hidden"
            aria-label={t("admin.closeSidebar")}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.href;
            const navItem = (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={onMobileClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive
                    ? "border-l-2 border-accent bg-accent text-accent-foreground"
                    : "text-card-foreground",
                  isCollapsed && "justify-center px-2"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-accent-foreground")} />
                {!isCollapsed && <span className="animate-fade-in">{t(item.key)}</span>}
              </NavLink>
            );

            if (isCollapsed) {
              return (
                <Tooltip key={item.href} delayDuration={0}>
                  <TooltipTrigger asChild>{navItem}</TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {t(item.key)}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return navItem;
          })}
        </nav>

        <Separator className="mx-3" />

        <div className="p-4">
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent",
              isCollapsed && "justify-center"
            )}
          >
            <Avatar className="h-10 w-10 border-2 border-accent/20">
              <AvatarImage
                src={user?.user_metadata?.avatar_url || "/placeholder.svg"}
                alt={displayName}
              />
              <AvatarFallback className="bg-accent text-accent-foreground font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 animate-fade-in">
                <p className="text-sm font-medium text-card-foreground">{displayName}</p>
                <p className="text-xs text-muted-foreground">{displayEmail}</p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <div className="mt-3 flex gap-2 animate-fade-in">
              <div className="flex overflow-hidden rounded-md border border-border">
                <Button
                  variant={language === "fr" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-8 rounded-none px-3"
                  onClick={() => setLanguage("fr")}
                >
                  FR
                </Button>
                <Button
                  variant={language === "ar" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-8 rounded-none px-3"
                  onClick={() => setLanguage("ar")}
                >
                  AR
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="flex-1 text-muted-foreground">
                <Bell className="mr-2 h-4 w-4" />
                {t("admin.alerts")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 text-muted-foreground"
                onClick={() => {
                  signOut();
                  onMobileClose();
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t("admin.logout")}
              </Button>
            </div>
          )}
        </div>

        <div className="hidden border-t border-border p-3 lg:block">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "w-full justify-center text-muted-foreground hover:text-foreground",
              !isCollapsed && "justify-start"
            )}
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")} />
            {!isCollapsed && <span>{t("admin.collapse")}</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
}
