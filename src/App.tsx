import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AnimatePresence } from "framer-motion";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Catalogue from "./pages/Catalogue";
import ProductDetail from "./pages/ProductDetail";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSettings from "./pages/admin/AdminSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <AnimatedRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
