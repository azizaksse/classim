import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useToast } from "@/hooks/use-toast";
import { Id } from "@convex/_generated/dataModel";

export interface ProductVariant {
  size: string;
  color: string;
  stock: number;
}

export interface Product {
  _id: Id<"products">;
  id: string; // keeping for compatibility, but should map to _id
  name: string;
  name_ar: string;
  name_fr: string;
  price: number;
  rent_price: number;
  sale_price: number | null;
  category: string;
  category_id: Id<"categories"> | null;
  image: string;
  images: string[];
  variants: ProductVariant[];
  sizes: string[];
  colors: string[];
  is_featured: boolean;
  is_active: boolean;
  createdAt: string;
  image_data?: { id?: string; url: string }[];
}

export const useProducts = () => {
  const { toast } = useToast();

  const productsData = useQuery(api.products.get);

  const createProduct = useMutation(api.products.create);
  const updateProductFn = useMutation(api.products.update);
  const deleteProductFn = useMutation(api.products.remove);

  const products: Product[] = (productsData || []).map((p: any) => ({
    ...p,
    id: p._id,
    name: p.name_fr,
    price: p.sale_price ?? p.rent_price,
    image: p.images?.[0] || "",
    category: p.category_name || "Uncategorized",
    variants:
      (p.sizes?.length || p.colors?.length)
        ? (p.sizes?.length && p.colors?.length
            ? p.sizes.flatMap((s: string) =>
                p.colors.map((c: string) => ({ size: s, color: c, stock: 10 }))
              )
            : (p.sizes?.length
                ? p.sizes.map((s: string) => ({ size: s, color: "Standard", stock: 10 }))
                : p.colors.map((c: string) => ({ size: "Standard", color: c, stock: 10 }))))
        : [],
    createdAt: p.created_at || new Date().toISOString(),
    image_data: p.image_data,
  }));

  const addProduct = async (newProduct: any) => {
    try {
      await createProduct(newProduct);
      toast({ title: "Product added successfully" });
    } catch (error: any) {
      toast({ title: "Error adding product", description: error.message, variant: "destructive" });
    }
  };

  const updateProduct = async ({ id, updates }: { id: string; updates: Partial<Product> }) => {
    try {
      // Filter out UI-only fields
      const { name, price, image, category, variants, createdAt, id: _, image_data, ...convexUpdates } = updates as any;

      await updateProductFn({
        id: id as Id<"products">,
        updates: convexUpdates
      });
      toast({ title: "Product updated successfully" });
    } catch (error: any) {
      toast({ title: "Error updating product", description: error.message, variant: "destructive" });
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteProductFn({ id: id as Id<"products"> });
      toast({ title: "Product deleted successfully" });
    } catch (error: any) {
      toast({ title: "Error deleting product", description: error.message, variant: "destructive" });
    }
  };

  const getTotalStock = (product: Product) => {
    return product.variants.reduce((sum, v) => sum + v.stock, 0);
  };

  return {
    products,
    isLoading: productsData === undefined,
    addProduct,
    updateProduct,
    deleteProduct,
    getTotalStock,
  };
};
