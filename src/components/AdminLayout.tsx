import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Package, 
  FolderOpen, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ChevronLeft
} from 'lucide-react';
import logo from '@/assets/logo.jpg';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: FolderOpen, label: 'Categories', path: '/admin/categories' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/50">
              <img src={logo} alt="Classimo" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-gradient-gold font-display">Admin</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="lg:hidden fixed inset-0 z-40 bg-background pt-16"
          >
            <nav className="p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="hidden lg:block fixed left-0 top-0 bottom-0 bg-card border-r border-border z-30"
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/50 flex-shrink-0">
              <img src={logo} alt="Classimo" className="w-full h-full object-cover" />
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-bold text-xl text-gradient-gold font-display"
                >
                  Admin Panel
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Toggle Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mb-6 self-end"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`} />
          </Button>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground shadow-gold'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            ))}
          </nav>

          {/* User Info & Sign Out */}
          <div className="border-t border-border pt-4 mt-4">
            {sidebarOpen && (
              <p className="text-xs text-muted-foreground mb-3 truncate">
                {user?.email}
              </p>
            )}
            <button
              onClick={handleSignOut}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all w-full ${
                !sidebarOpen ? 'justify-center' : ''
              }`}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Sign Out
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Back to Site */}
          <Link
            to="/"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all mt-2 ${
              !sidebarOpen ? 'justify-center' : ''
            }`}
          >
            <ChevronLeft className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  View Site
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main 
        className={`lg:transition-all lg:duration-300 pt-16 lg:pt-0 ${
          sidebarOpen ? 'lg:ml-[280px]' : 'lg:ml-[80px]'
        }`}
      >
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
