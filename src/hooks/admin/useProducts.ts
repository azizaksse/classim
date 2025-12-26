import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ProductVariant {
  size: string;
  color: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  name_ar: string;
  name_fr: string;
  price: number;
  rent_price: number;
  sale_price: number | null;
  category: string;
  category_id: string | null;
  image: string;
  images: string[];
  variants: ProductVariant[];
  sizes: string[];
  is_featured: boolean;
  is_active: boolean;
  createdAt: string;
}

export const useProducts = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name_fr)")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map((p: any) => ({
        ...p,
        name: p.name_fr,
        price: p.rent_price,
        image: p.images?.[0] || "",
        category: p.categories?.name_fr || "Uncategorized",
        variants: p.sizes?.map((s: string) => ({ size: s, color: "Default", stock: 10 })) || [], // Mocking variants for UI compatibility
        createdAt: p.created_at,
      })) as Product[];
    },
  });

  const addProductMutation = useMutation({
    mutationFn: async (newProduct: Omit<Product, "id" | "createdAt" | "name" | "price" | "image" | "category" | "variants">) => {
      const { data, error } = await supabase.from("products").insert([newProduct]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast({ title: "Product added successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error adding product", description: error.message, variant: "destructive" });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Product> }) => {
      // Remove UI-only fields before sending to Supabase
      const { name, price, image, category, variants, createdAt, ...supabaseUpdates } = updates as any;
      const { data, error } = await supabase.from("products").update(supabaseUpdates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast({ title: "Product updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error updating product", description: error.message, variant: "destructive" });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast({ title: "Product deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error deleting product", description: error.message, variant: "destructive" });
    },
  });

  const getTotalStock = (product: Product) => {
    return product.variants.reduce((sum, v) => sum + v.stock, 0);
  };

  return {
    products,
    isLoading,
    addProduct: addProductMutation.mutate,
    updateProduct: updateProductMutation.mutate,
    deleteProduct: deleteProductMutation.mutate,
    getTotalStock,
  };
};
