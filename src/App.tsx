import { lazy, Suspense, useEffect, useState } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
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
import { ThemeProvider } from "next-themes";
const TrackingSection = lazy(() => import("./components/TrackingSection"));

// Lazy load all pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Catalogue = lazy(() => import("./pages/Catalogue"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const Auth = lazy(() => import("./pages/Auth"));
const AdminAccess = lazy(() => import("./pages/AdminAccess"));
const AdminDashboard = lazy(() => import("./pages/admin-new/Dashboard"));
const AdminProducts = lazy(() => import("./pages/admin-new/Products"));
const AdminCategories = lazy(() => import("./pages/admin-new/Categories"));
const AdminOrders = lazy(() => import("./pages/admin-new/Orders"));
const AdminCustomers = lazy(() => import("./pages/admin-new/Customers"));
const AdminSettings = lazy(() => import("./pages/admin-new/Settings"));
const ThankYou = lazy(() => import("./pages/ThankYou"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (previously cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL || "");

// Loading fallback for lazy loaded components
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      <p className="text-muted-foreground text-sm">Loading...</p>
    </div>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Index />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin-access" element={<AdminAccess />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

const useDeferredMount = (delayMs = 800) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let timeoutId: number | null = null;
    let idleId: number | null = null;

    const onReady = () => setReady(true);

    if ("requestIdleCallback" in window) {
      idleId = (window as Window & { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(onReady);
    } else {
      timeoutId = window.setTimeout(onReady, delayMs);
    }

    return () => {
      if (idleId !== null && "cancelIdleCallback" in window) {
        (window as Window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleId);
      }
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [delayMs]);

  return ready;
};

const Overlays = () => {
  const location = useLocation();
  const showOverlays = useDeferredMount();

  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  if (!showOverlays) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <TrackingSection />
    </Suspense>
  );
};

const App = () => {
  return (
    <HelmetProvider>
      <ConvexProvider client={convex}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <AuthProvider>
              <LanguageProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <ScrollToTop />
                    <Overlays />
                    <AnimatedRoutes />
                  </BrowserRouter>
                </TooltipProvider>
              </LanguageProvider>
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </ConvexProvider>
    </HelmetProvider>
  );
};

export default App;
