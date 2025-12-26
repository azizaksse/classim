import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "@/components/ImageUpload";

interface AddProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (product: any) => void;
  product?: any;
}

export const AddProductForm = ({
  open,
  onOpenChange,
  onSubmit,
  product,
}: AddProductFormProps) => {
  const [nameAr, setNameAr] = useState(product?.name_ar || "");
  const [nameFr, setNameFr] = useState(product?.name_fr || "");
  const [descriptionAr, setDescriptionAr] = useState(product?.description_ar || "");
  const [descriptionFr, setDescriptionFr] = useState(product?.description_fr || "");
  const [rentPrice, setRentPrice] = useState(product?.rent_price?.toString() || "");
  const [salePrice, setSalePrice] = useState(product?.sale_price?.toString() || "");
  const [categoryId, setCategoryId] = useState(product?.category_id || "");
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [sizes, setSizes] = useState<string[]>(product?.sizes || ["M"]);
  const [isFeatured, setIsFeatured] = useState(product?.is_featured || false);
  const [isActive, setIsActive] = useState(product?.is_active || true);

  const { data: categories } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name_fr");
      if (error) throw error;
      return data;
    },
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameAr.trim() || !nameFr.trim()) {
      toast.error("Please enter product names in both languages");
      return;
    }
    if (!rentPrice || parseFloat(rentPrice) <= 0) {
      toast.error("Please enter a valid rent price");
      return;
    }

    onSubmit({
      name_ar: nameAr.trim(),
      name_fr: nameFr.trim(),
      description_ar: descriptionAr.trim(),
      description_fr: descriptionFr.trim(),
      rent_price: parseFloat(rentPrice),
      sale_price: salePrice ? parseFloat(salePrice) : null,
      category_id: categoryId || null,
      images: images.length > 0 ? images : ["/placeholder.svg"],
      sizes,
      is_featured: isFeatured,
      is_active: isActive,
    });

    // Reset form
    setNameAr("");
    setNameFr("");
    setDescriptionAr("");
    setDescriptionFr("");
    setRentPrice("");
    setSalePrice("");
    setCategoryId("");
    setImages([]);
    setSizes(["M"]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Names */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name_fr">Name (French) *</Label>
              <Input
                id="name_fr"
                value={nameFr}
                onChange={(e) => setNameFr(e.target.value)}
                placeholder="e.g., Silk Evening Gown"
                className="input-luxury"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name_ar">Name (Arabic) *</Label>
              <Input
                id="name_ar"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                placeholder="اسم المنتج"
                className="input-luxury text-right"
                dir="rtl"
              />
            </div>
          </div>

          {/* Descriptions */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="desc_fr">Description (French)</Label>
              <Textarea
                id="desc_fr"
                value={descriptionFr}
                onChange={(e) => setDescriptionFr(e.target.value)}
                className="input-luxury"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc_ar">Description (Arabic)</Label>
              <Textarea
                id="desc_ar"
                value={descriptionAr}
                onChange={(e) => setDescriptionAr(e.target.value)}
                className="input-luxury text-right"
                dir="rtl"
              />
            </div>
          </div>

          {/* Prices & Category */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="rent_price">Rent Price (DA) *</Label>
              <Input
                id="rent_price"
                type="number"
                value={rentPrice}
                onChange={(e) => setRentPrice(e.target.value)}
                className="input-luxury"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sale_price">Sale Price (DA)</Label>
              <Input
                id="sale_price"
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                className="input-luxury"
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="input-luxury">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name_fr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-2">
            <Label>Available Sizes</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {["46", "48", "50", "52", "54", "56", "S", "M", "L", "XL", "XXL"].map((size) => (
                <Button
                  key={size}
                  type="button"
                  variant={sizes.includes(size) ? "gold" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (sizes.includes(size)) {
                      setSizes(sizes.filter((s) => s !== size));
                    } else {
                      setSizes([...sizes, size]);
                    }
                  }}
                  className="h-8 px-3"
                >
                  {size}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add custom size..."
                className="input-luxury h-8"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const val = e.currentTarget.value.trim();
                    if (val && !sizes.includes(val)) {
                      setSizes([...sizes, val]);
                      e.currentTarget.value = "";
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label>Product Images</Label>
            <ImageUpload
              value={images}
              onChange={setImages}
              maxFiles={8}
            />
          </div>

          {/* Settings */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded border-gray-300 text-accent focus:ring-accent"
              />
              <span className="text-sm font-medium">Featured Product</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-gray-300 text-accent focus:ring-accent"
              />
              <span className="text-sm font-medium">Active</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {product ? "Update Product" : "Add Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
