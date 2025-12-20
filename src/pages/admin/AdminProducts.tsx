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
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react';

interface Product {
  id: string;
  name_ar: string;
  name_fr: string;
  description_ar: string | null;
  description_fr: string | null;
  images: string[];
  rent_price: number;
  sale_price: number | null;
  sizes: string[];
  category_id: string | null;
  is_featured: boolean;
  is_active: boolean;
  categories?: { name_fr: string } | null;
}

interface Category {
  id: string;
  name_ar: string;
  name_fr: string;
}

const AdminProducts = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name_ar: '',
    name_fr: '',
    description_ar: '',
    description_fr: '',
    images: '',
    rent_price: 0,
    sale_price: 0,
    sizes: '',
    category_id: '',
    is_featured: false,
    is_active: true,
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name_fr)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Product[];
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name_fr');
      if (error) throw error;
      return data as Category[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from('products').insert({
        name_ar: data.name_ar,
        name_fr: data.name_fr,
        description_ar: data.description_ar || null,
        description_fr: data.description_fr || null,
        images: data.images.split(',').map(s => s.trim()).filter(Boolean),
        rent_price: data.rent_price,
        sale_price: data.sale_price || null,
        sizes: data.sizes.split(',').map(s => s.trim()).filter(Boolean),
        category_id: data.category_id || null,
        is_featured: data.is_featured,
        is_active: data.is_active,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: 'Product created successfully!' });
      resetForm();
    },
    onError: (error) => {
      toast({ title: 'Error creating product', description: error.message, variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase.from('products').update({
        name_ar: data.name_ar,
        name_fr: data.name_fr,
        description_ar: data.description_ar || null,
        description_fr: data.description_fr || null,
        images: data.images.split(',').map(s => s.trim()).filter(Boolean),
        rent_price: data.rent_price,
        sale_price: data.sale_price || null,
        sizes: data.sizes.split(',').map(s => s.trim()).filter(Boolean),
        category_id: data.category_id || null,
        is_featured: data.is_featured,
        is_active: data.is_active,
      }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: 'Product updated successfully!' });
      resetForm();
    },
    onError: (error) => {
      toast({ title: 'Error updating product', description: error.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: 'Product deleted successfully!' });
    },
    onError: (error) => {
      toast({ title: 'Error deleting product', description: error.message, variant: 'destructive' });
    },
  });

  const resetForm = () => {
    setFormData({
      name_ar: '',
      name_fr: '',
      description_ar: '',
      description_fr: '',
      images: '',
      rent_price: 0,
      sale_price: 0,
      sizes: '',
      category_id: '',
      is_featured: false,
      is_active: true,
    });
    setEditingProduct(null);
    setIsDialogOpen(false);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name_ar: product.name_ar,
      name_fr: product.name_fr,
      description_ar: product.description_ar || '',
      description_fr: product.description_fr || '',
      images: product.images.join(', '),
      rent_price: product.rent_price,
      sale_price: product.sale_price || 0,
      sizes: product.sizes.join(', '),
      category_id: product.category_id || '',
      is_featured: product.is_featured,
      is_active: product.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const filteredProducts = products?.filter(p =>
    p.name_fr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.name_ar.includes(searchQuery)
  );

  return (
    <AdminGuard>
      <Helmet>
        <title>Products | Classimo Admin</title>
      </Helmet>

      <AdminLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gradient-gold font-display">Products</h1>
              <p className="text-muted-foreground mt-1">Manage your product catalog</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); setIsDialogOpen(open); }}>
              <DialogTrigger asChild>
                <Button variant="gold">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
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
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="description_ar">Description (Arabic)</Label>
                      <Textarea
                        id="description_ar"
                        value={formData.description_ar}
                        onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description_fr">Description (French)</Label>
                      <Textarea
                        id="description_fr"
                        value={formData.description_fr}
                        onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="images">Image URLs (comma-separated)</Label>
                    <Textarea
                      id="images"
                      value={formData.images}
                      onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                      placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="rent_price">Rent Price (DA)</Label>
                      <Input
                        id="rent_price"
                        type="number"
                        value={formData.rent_price}
                        onChange={(e) => setFormData({ ...formData, rent_price: parseInt(e.target.value) || 0 })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="sale_price">Sale Price (DA)</Label>
                      <Input
                        id="sale_price"
                        type="number"
                        value={formData.sale_price}
                        onChange={(e) => setFormData({ ...formData, sale_price: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sizes">Sizes (comma-separated)</Label>
                      <Input
                        id="sizes"
                        value={formData.sizes}
                        onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                        placeholder="S, M, L, XL"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category_id}
                        onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name_fr}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.is_featured}
                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                        className="rounded"
                      />
                      Featured
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="rounded"
                      />
                      Active
                    </label>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="gold">
                      {editingProduct ? 'Update' : 'Create'} Product
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Products Table */}
          <div className="glass-card rounded-2xl overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading...</div>
            ) : filteredProducts?.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No products found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="text-left p-4 font-medium">Product</th>
                      <th className="text-left p-4 font-medium">Category</th>
                      <th className="text-left p-4 font-medium">Rent Price</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts?.map((product, index) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-t border-border hover:bg-secondary/30"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {product.images[0] && (
                              <img
                                src={product.images[0]}
                                alt={product.name_fr}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium">{product.name_fr}</p>
                              <p className="text-sm text-muted-foreground" dir="rtl">{product.name_ar}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {product.categories?.name_fr || '-'}
                        </td>
                        <td className="p-4">
                          {product.rent_price.toLocaleString()} DA
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            product.is_active
                              ? 'bg-green-500/20 text-green-500'
                              : 'bg-red-500/20 text-red-500'
                          }`}>
                            {product.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(product)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteMutation.mutate(product.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
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

export default AdminProducts;
