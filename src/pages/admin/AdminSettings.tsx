import { Helmet } from 'react-helmet-async';
import AdminGuard from '@/components/AdminGuard';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';

const AdminSettings = () => {
  const { user } = useAuth();

  return (
    <AdminGuard>
      <Helmet>
        <title>Settings | Classimo Admin</title>
      </Helmet>

      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gradient-gold font-display">Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">User ID</label>
                <p className="font-mono text-sm text-muted-foreground">{user?.id}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Created At</label>
                <p className="font-medium">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Admin Panel Info</h2>
            <p className="text-muted-foreground text-sm">
              This admin panel allows you to manage products, categories, and users. 
              Only users with the "admin" role can access this panel.
            </p>
          </div>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
};

export default AdminSettings;
