import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminGuard from '@/components/AdminGuard';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Category {
  id: string;
  name_ar: string;
  name_fr: string;
  image_url: string | null;
  created_at: string;
}

const AdminCategories = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name_ar: '',
    name_fr: '',
    image_url: '',
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Category[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from('categories').insert({
        name_ar: data.name_ar,
        name_fr: data.name_fr,
        image_url: data.image_url || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast({ title: 'Category created successfully!' });
      resetForm();
    },
    onError: (error) => {
      toast({ title: 'Error creating category', description: error.message, variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase.from('categories').update({
        name_ar: data.name_ar,
        name_fr: data.name_fr,
        image_url: data.image_url || null,
      }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast({ title: 'Category updated successfully!' });
      resetForm();
    },
    onError: (error) => {
      toast({ title: 'Error updating category', description: error.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast({ title: 'Category deleted successfully!' });
    },
    onError: (error) => {
      toast({ title: 'Error deleting category', description: error.message, variant: 'destructive' });
    },
  });

  const resetForm = () => {
    setFormData({ name_ar: '', name_fr: '', image_url: '' });
    setEditingCategory(null);
    setIsDialogOpen(false);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name_ar: category.name_ar,
      name_fr: category.name_fr,
      image_url: category.image_url || '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <AdminGuard>
      <Helmet>
        <title>Categories | Classimo Admin</title>
      </Helmet>

      <AdminLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gradient-gold font-display">Categories</h1>
              <p className="text-muted-foreground mt-1">Manage product categories</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); setIsDialogOpen(open); }}>
              <DialogTrigger asChild>
                <Button variant="gold">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name_ar">Name (Arabic)</Label>
                    <Input
                      id="name_ar"
                      value={formData.name_ar}
                      onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                      required
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="name_fr">Name (French)</Label>
                    <Input
                      id="name_fr"
                      value={formData.name_fr}
                      onChange={(e) => setFormData({ ...formData, name_fr: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="gold">
                      {editingCategory ? 'Update' : 'Create'} Category
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Categories Grid */}
          {isLoading ? (
            <div className="text-center text-muted-foreground py-8">Loading...</div>
          ) : categories?.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No categories found</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories?.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card rounded-2xl overflow-hidden"
                >
                  {category.image_url && (
                    <div className="aspect-video">
                      <img
                        src={category.image_url}
                        alt={category.name_fr}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{category.name_fr}</h3>
                    <p className="text-muted-foreground" dir="rtl">{category.name_ar}</p>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(category)}
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMutation.mutate(category.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminGuard>
  );
};

export default AdminCategories;
