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
    id: p._id,
    nameAr: p.name_ar,
    nameFr: p.name_fr,
    descriptionAr: p.description_ar || "",
    descriptionFr: p.description_fr || "",
    images: Array.isArray(p.images) && p.images.length ? p.images : ["/placeholder.svg"],
    rentPrice: p.sale_price ?? p.rent_price,
    salePrice: undefined,
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
