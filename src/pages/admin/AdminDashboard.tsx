import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminGuard from '@/components/AdminGuard';
import AdminLayout from '@/components/AdminLayout';
import { Package, FolderOpen, Users, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const { data: productsCount } = useQuery({
    queryKey: ['admin-products-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: categoriesCount } = useQuery({
    queryKey: ['admin-categories-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: usersCount } = useQuery({
    queryKey: ['admin-users-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const stats = [
    { label: 'Products', value: productsCount || 0, icon: Package, color: 'text-blue-500' },
    { label: 'Categories', value: categoriesCount || 0, icon: FolderOpen, color: 'text-green-500' },
    { label: 'Users', value: usersCount || 0, icon: Users, color: 'text-purple-500' },
    { label: 'Growth', value: '+12%', icon: TrendingUp, color: 'text-primary' },
  ];

  return (
    <AdminGuard>
      <Helmet>
        <title>Dashboard | Classimo Admin</title>
      </Helmet>

      <AdminLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gradient-gold font-display">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome to your admin panel</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-secondary ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a
                href="/admin/products"
                className="flex items-center gap-3 p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <Package className="w-5 h-5 text-primary" />
                <span>Manage Products</span>
              </a>
              <a
                href="/admin/categories"
                className="flex items-center gap-3 p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <FolderOpen className="w-5 h-5 text-primary" />
                <span>Manage Categories</span>
              </a>
              <a
                href="/admin/users"
                className="flex items-center gap-3 p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <Users className="w-5 h-5 text-primary" />
                <span>Manage Users</span>
              </a>
            </div>
          </div>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
};

export default AdminDashboard;
