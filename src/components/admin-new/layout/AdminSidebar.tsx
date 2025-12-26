import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Crown,
  LogOut,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { title: "Products", icon: Package, href: "/admin/products" },
  { title: "Orders", icon: ShoppingCart, href: "/admin/orders" },
  { title: "Customers", icon: Users, href: "/admin/customers" },
  { title: "Settings", icon: Settings, href: "/admin/settings" },
];

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-out",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          <div className={cn("flex items-center gap-3 overflow-hidden", collapsed && "justify-center")}>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
              <Crown className="h-5 w-5 text-accent-foreground" />
            </div>
            {!collapsed && (
              <div className="animate-fade-in">
                <h1 className="font-heading text-lg font-semibold text-sidebar-foreground">
                  Classimo
                </h1>
                <p className="text-xs text-muted-foreground">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.href;
            const NavItem = (
              <NavLink
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive
                    ? "bg-sidebar-accent text-accent border-l-2 border-accent"
                    : "text-sidebar-foreground",
                  collapsed && "justify-center px-2"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-accent")} />
                {!collapsed && (
                  <span className="animate-fade-in">{item.title}</span>
                )}
              </NavLink>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.href} delayDuration={0}>
                  <TooltipTrigger asChild>{NavItem}</TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return NavItem;
          })}
        </nav>

        <Separator className="mx-3" />

        {/* User Profile */}
        <div className="p-4">
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-sidebar-accent",
              collapsed && "justify-center"
            )}
          >
            <Avatar className="h-10 w-10 border-2 border-accent/20">
              <AvatarImage src="/placeholder.svg" alt="Admin" />
              <AvatarFallback className="bg-accent text-accent-foreground font-medium">
                AK
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 animate-fade-in">
                <p className="text-sm font-medium text-sidebar-foreground">
                  Admin User
                </p>
                <p className="text-xs text-muted-foreground">admin@classimo.com</p>
              </div>
            )}
          </div>

          {!collapsed && (
            <div className="mt-3 flex gap-2 animate-fade-in">
              <Button variant="ghost" size="sm" className="flex-1 text-muted-foreground">
                <Bell className="h-4 w-4 mr-2" />
                Alerts
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 text-muted-foreground">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>

        {/* Collapse Button */}
        <div className="border-t border-sidebar-border p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "w-full justify-center text-muted-foreground hover:text-foreground",
              !collapsed && "justify-start"
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span>Collapse</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}
