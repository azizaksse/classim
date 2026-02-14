import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import AdminGuard from '@/components/AdminGuard';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react';
import ImageUpload, { UploadedImage } from '@/components/ImageUpload';
import { useProducts, Product } from '@/hooks/admin/useProducts';

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
    images: [] as UploadedImage[],
    rent_price: 0,
    sale_price: 0,
    sizes: '',
    category_id: '',
    is_featured: false,
    is_active: true,
  });

  const { products, isLoading, addProduct, updateProduct, deleteProduct } = useProducts();

  const categoriesData = useQuery(api.categories.get);
  const categories: Category[] = (categoriesData || []).map((c: any) => ({
    id: c._id,
    name_ar: c.name_ar,
    name_fr: c.name_fr,
  }));

  const resetForm = () => {
    setFormData({
      name_ar: '',
      name_fr: '',
      description_ar: '',
      description_fr: '',
      images: [],
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
    const images: UploadedImage[] = product.image_data
      ? product.image_data
      : (product.images || []).map(url => ({ url }));

    setFormData({
      name_ar: product.name_ar,
      name_fr: product.name_fr,
      description_ar: (product as any).description_ar || '',
      description_fr: (product as any).description_fr || '',
      images: images,
      rent_price: product.rent_price,
      sale_price: product.sale_price || 0,
      sizes: product.sizes.join(', '),
      category_id: product.category_id || '',
      is_featured: product.is_featured,
      is_active: product.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      ...formData,
      sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
      category_id: formData.category_id || undefined,
      images: formData.images.map(img => img.id || img.url),
    };

    if (editingProduct) {
      await updateProduct({ id: editingProduct.id, updates: productData });
    } else {
      await addProduct(productData);
    }
    resetForm();
  };

  const filteredProducts = products?.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
                    <Label>Product Images</Label>
                    <ImageUpload
                      value={formData.images}
                      onChange={(urls) => setFormData({ ...formData, images: urls })}
                      maxFiles={5}
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
                                alt={product.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground" dir="rtl">{product.name_ar}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {product.category || '-'}
                        </td>
                        <td className="p-4">
                          {product.rent_price.toLocaleString()} DA
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${product.is_active
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
                              onClick={() => deleteProduct(product.id)}
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
