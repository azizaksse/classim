import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

export interface StoreProduct {
  id: string;
  nameAr: string;
  nameFr: string;
  descriptionAr: string;
  descriptionFr: string;
  images: string[];
  rentPrice: number;
  salePrice?: number;
  originalPrice?: number;
  salePercentage?: number;
  stock?: number;
  inStock?: boolean;
  sizes: string[];
  colors: string[];
  categoryId?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  categoryName?: string;
}

export const useStoreProducts = () => {
  const productsData = useQuery(api.products.get);

  const products: StoreProduct[] = (productsData || []).map((p: any) => ({
    // Prefer stored sale_price, otherwise compute from sale_percentage.
    // Fallback to rent_price.
    id: p._id,
    nameAr: p.name_ar,
    nameFr: p.name_fr,
    descriptionAr: p.description_ar || "",
    descriptionFr: p.description_fr || "",
    images: Array.isArray(p.images) && p.images.length ? p.images : ["/placeholder.svg"],
    rentPrice:
      (typeof p.sale_price === "number"
        ? p.sale_price
        : (typeof p.sale_percentage === "number" && p.sale_percentage > 0)
          ? Number((p.rent_price * (1 - p.sale_percentage / 100)).toFixed(2))
          : p.rent_price),
    salePrice: typeof p.sale_price === "number" ? p.sale_price : undefined,
    originalPrice: p.rent_price,
    salePercentage: typeof p.sale_percentage === "number" ? p.sale_percentage : undefined,
    stock: typeof p.stock === "number" ? p.stock : 0,
    inStock: (typeof p.stock === "number" ? p.stock : 0) > 0,
    sizes: Array.isArray(p.sizes) ? p.sizes : [],
    colors: Array.isArray(p.colors) ? p.colors : [],
    categoryId: p.category_id || undefined,
    isFeatured: p.is_featured || false,
    isActive: p.is_active !== false,
    categoryName: p.category_name,
  }));

  return {
    products,
    isLoading: productsData === undefined,
  };
};
