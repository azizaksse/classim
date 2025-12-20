import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminGuard from '@/components/AdminGuard';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Shield, ShieldCheck, User } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
}

const AdminUsers = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: profiles, isLoading: profilesLoading } = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Profile[];
    },
  });

  const { data: userRoles } = useQuery({
    queryKey: ['admin-user-roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*');
      if (error) throw error;
      return data as UserRole[];
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole | 'none' }) => {
      // First delete existing role
      await supabase.from('user_roles').delete().eq('user_id', userId);
      
      // If not 'none', insert new role
      if (role !== 'none') {
        const { error } = await supabase.from('user_roles').insert({
          user_id: userId,
          role: role,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-user-roles'] });
      toast({ title: 'User role updated successfully!' });
    },
    onError: (error) => {
      toast({ title: 'Error updating role', description: error.message, variant: 'destructive' });
    },
  });

  const getUserRole = (userId: string): AppRole | 'none' => {
    const role = userRoles?.find(r => r.user_id === userId);
    return role?.role || 'none';
  };

  const getRoleIcon = (role: AppRole | 'none') => {
    switch (role) {
      case 'admin':
        return <ShieldCheck className="w-4 h-4 text-primary" />;
      case 'moderator':
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <User className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <AdminGuard>
      <Helmet>
        <title>Users | Classimo Admin</title>
      </Helmet>

      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gradient-gold font-display">Users</h1>
            <p className="text-muted-foreground mt-1">Manage user roles and permissions</p>
          </div>

          {/* Users Table */}
          <div className="glass-card rounded-2xl overflow-hidden">
            {profilesLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading...</div>
            ) : profiles?.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No users found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="text-left p-4 font-medium">User</th>
                      <th className="text-left p-4 font-medium">Email</th>
                      <th className="text-left p-4 font-medium">Joined</th>
                      <th className="text-left p-4 font-medium">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles?.map((profile, index) => (
                      <motion.tr
                        key={profile.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-t border-border hover:bg-secondary/30"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                              {getRoleIcon(getUserRole(profile.user_id))}
                            </div>
                            <span className="font-medium">
                              {profile.full_name || 'Unknown'}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {profile.email || '-'}
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {new Date(profile.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <Select
                            value={getUserRole(profile.user_id)}
                            onValueChange={(value) => updateRoleMutation.mutate({ 
                              userId: profile.user_id, 
                              role: value as AppRole | 'none' 
                            })}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No Role</SelectItem>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="moderator">Moderator</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
};

export default AdminUsers;
