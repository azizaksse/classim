import { useState, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
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
import ImageUpload, { UploadedImage } from "@/components/ImageUpload";

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
  const [basePrice, setBasePrice] = useState(product?.rent_price?.toString() || "");
  const [salePercentage, setSalePercentage] = useState(
    product?.sale_percentage !== undefined ? String(product.sale_percentage) : "0"
  );
  const [stock, setStock] = useState(
    product?.stock !== undefined ? String(product.stock) : "0"
  );
  const [categoryId, setCategoryId] = useState(product?.category_id || "");
  const [images, setImages] = useState<UploadedImage[]>(
    (product?.images || []).map((url: string) => ({ url }))
  );
  const [sizes, setSizes] = useState<string[]>(product?.sizes || ["M"]);
  const [colors, setColors] = useState<string[]>(product?.colors || ["Black"]);
  const [customSize, setCustomSize] = useState("");
  const [customColor, setCustomColor] = useState("");
  const [isFeatured, setIsFeatured] = useState(product?.is_featured || false);
  const [isActive, setIsActive] = useState(product?.is_active ?? true);

  const categories = useQuery(api.categories.get);

  const normalizeList = (values: string[]) =>
    Array.from(
      new Set(
        values
          .map((value) => value.normalize("NFKC"))
          .map((value) => value.trim())
          .filter(Boolean)
      )
    );

  const addCustomSize = () => {
    const value = customSize.trim();
    if (!value) return;
    if (!sizes.includes(value)) {
      setSizes([...sizes, value]);
    }
    setCustomSize("");
  };

  const addCustomColor = () => {
    const value = customColor.trim();
    if (!value) return;
    if (!colors.includes(value)) {
      setColors([...colors, value]);
    }
    setCustomColor("");
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameAr.trim() || !nameFr.trim()) {
      toast.error("Please enter product names in both languages");
      return;
    }
    if (!basePrice || parseFloat(basePrice) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    const parsedSalePercentage = Number(salePercentage);
    if (!Number.isFinite(parsedSalePercentage) || parsedSalePercentage < 0 || parsedSalePercentage > 100) {
      toast.error("Sale percentage must be between 0 and 100");
      return;
    }

    const parsedStock = Number(stock);
    if (!Number.isFinite(parsedStock) || parsedStock < 0) {
      toast.error("Please enter a valid stock");
      return;
    }

    const nextSizes = normalizeList([...sizes, customSize]);
    const nextColors = normalizeList([...colors, customColor]);

    onSubmit({
      name_ar: nameAr.trim(),
      name_fr: nameFr.trim(),
      description_ar: descriptionAr.trim(),
      description_fr: descriptionFr.trim(),
      rent_price: parseFloat(basePrice),
      sale_percentage: parsedSalePercentage,
      stock: Math.floor(parsedStock),
      category_id: categoryId || undefined,
      images:
        images.length > 0
          ? images.map((img) => img.id || img.url)
          : ["/placeholder.svg"],
      sizes: nextSizes.length ? nextSizes : ["M"],
      colors: nextColors.length ? nextColors : ["Black"],
      is_featured: isFeatured,
      is_active: isActive,
    });

    // Reset form
    setNameAr("");
    setNameFr("");
    setDescriptionAr("");
    setDescriptionFr("");
    setBasePrice("");
    setSalePercentage("0");
    setStock("0");
    setCategoryId("");
    setImages([]);
    setSizes(["M"]);
    setColors(["Black"]);
    setCustomSize("");
    setCustomColor("");
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rent_price">Base Price (DA) *</Label>
              <Input
                id="rent_price"
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="input-luxury"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sale_percentage">Sale (%)</Label>
              <Input
                id="sale_percentage"
                type="number"
                min={0}
                max={100}
                step="1"
                value={salePercentage}
                onChange={(e) => setSalePercentage(e.target.value)}
                className="input-luxury"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                min={0}
                step="1"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
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
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.name_fr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-2">
            <Label>Available Sizes / المقاسات المتوفرة</Label>
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
            {sizes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <Button
                    key={`selected-size-${size}`}
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-8 px-3"
                    onClick={() => setSizes(sizes.filter((s) => s !== size))}
                  >
                    {size} ×
                  </Button>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                placeholder="Add custom size... / أضف مقاس"
                className="input-luxury h-8"
                value={customSize}
                onChange={(e) => setCustomSize(e.target.value)}
                dir="auto"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomSize();
                  }
                }}
              />
              <Button type="button" size="sm" variant="outline" onClick={addCustomSize}>
                Add / إضافة
              </Button>
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-2">
            <Label>Available Colors / الألوان المتوفرة</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {["Black", "White", "Navy", "Gray", "Beige", "Brown", "Green", "Burgundy"].map((color) => (
                <Button
                  key={color}
                  type="button"
                  variant={colors.includes(color) ? "gold" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (colors.includes(color)) {
                      setColors(colors.filter((c) => c !== color));
                    } else {
                      setColors([...colors, color]);
                    }
                  }}
                  className="h-8 px-3"
                >
                  {color}
                </Button>
              ))}
            </div>
            {colors.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <Button
                    key={`selected-color-${color}`}
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-8 px-3"
                    onClick={() => setColors(colors.filter((c) => c !== color))}
                  >
                    {color} ×
                  </Button>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                placeholder="Add custom color... / أضف لون"
                className="input-luxury h-8"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                dir="auto"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomColor();
                  }
                }}
              />
              <Button type="button" size="sm" variant="outline" onClick={addCustomColor}>
                Add / إضافة
              </Button>
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
