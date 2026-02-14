import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { AdminLayout } from "@/components/admin-new/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, FolderOpen } from "lucide-react";
import ImageUpload, { UploadedImage } from "@/components/ImageUpload";
import { useAdminLanguage } from "@/contexts/AdminLanguageContext";

interface Category {
  _id: Id<"categories">;
  name_ar: string;
  name_fr: string;
  image_url?: string | null;
  image_data?: { id?: string; url: string }[];
  created_at?: string;
}

const Categories = () => {
  const { t, dir } = useAdminLanguage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name_ar: "",
    name_fr: "",
    image_url: [] as UploadedImage[],
  });

  const { toast } = useToast();

  const categoriesData = useQuery(api.categories.get);
  const productsData = useQuery(api.products.get);

  const createCategory = useMutation(api.categories.create);
  const updateCategory = useMutation(api.categories.update);
  const deleteCategory = useMutation(api.categories.remove);

  const categories: Category[] = (categoriesData || []) as Category[];
  const products = productsData || [];

  const resetForm = () => {
    setFormData({ name_ar: "", name_fr: "", image_url: [] });
    setEditingCategory(null);
    setIsDialogOpen(false);
  };

  const openCreateDialog = () => {
    setEditingCategory(null);
    setFormData({ name_ar: "", name_fr: "", image_url: [] });
    setIsDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name_ar: category.name_ar,
      name_fr: category.name_fr,
      image_url: category.image_data?.length
        ? category.image_data.map((img) => ({ id: img.id, url: img.url }))
        : category.image_url
          ? [{ url: category.image_url }]
          : [],
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const imageUrl = formData.image_url[0]?.id || formData.image_url[0]?.url;

      if (editingCategory) {
        await updateCategory({
          id: editingCategory._id,
          updates: {
            name_ar: formData.name_ar.trim(),
            name_fr: formData.name_fr.trim(),
            image_url: imageUrl || undefined,
          },
        });
        toast({ title: t("categories.updated") });
      } else {
        await createCategory({
          name_ar: formData.name_ar.trim(),
          name_fr: formData.name_fr.trim(),
          image_url: imageUrl || undefined,
        });
        toast({ title: t("categories.created") });
      }
      resetForm();
    } catch (error: any) {
      toast({
        title: t("categories.saveError"),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: Id<"categories">) => {
    try {
      await deleteCategory({ id });
      toast({ title: t("categories.deleted") });
    } catch (error: any) {
      toast({
        title: t("categories.deleteError"),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-semibold tracking-tight">
              {t("categories.title")}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t("categories.subtitle")}
            </p>
          </div>
          <Button
            onClick={openCreateDialog}
            className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("categories.addCategory")}
          </Button>
        </div>

        {/* Empty State */}
        {categoriesData === undefined ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse text-muted-foreground">{t("common.loading")}</div>
          </div>
        ) : categories.length === 0 ? (
          <div className="card-luxury p-12 text-center">
            <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-heading text-xl font-medium mb-2">
              {t("categories.none")}
            </h3>
            <p className="text-muted-foreground mb-6">
              {t("categories.noneSub")}
            </p>
            <Button
              onClick={openCreateDialog}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t("categories.addCategory")}
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => {
              const productCount = products.filter(
                (p: any) => p.category_id === category._id
              ).length;
              return (
                <div
                  key={category._id}
                  className="card-luxury overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  {(category.image_data?.[0]?.url || category.image_url) && (
                    <div className="aspect-video bg-secondary">
                      <img
                        src={category.image_data?.[0]?.url || category.image_url || "/placeholder.svg"}
                        alt={category.name_fr}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">
                      {category.name_fr}
                    </h3>
                    <p className="text-muted-foreground text-sm" dir="rtl">
                      {category.name_ar}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">{productCount} {t("categories.productsCount")}</p>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(category)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        {t("common.edit")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(category._id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        {t("common.delete")}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">
              {editingCategory ? t("categories.editCategory") : t("categories.addNewCategory")}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <Label htmlFor="name_fr">{t("categories.nameFr")}</Label>
              <Input
                id="name_fr"
                value={formData.name_fr}
                onChange={(e) =>
                  setFormData({ ...formData, name_fr: e.target.value })
                }
                required
                className="input-luxury"
              />
            </div>
            <div>
              <Label htmlFor="name_ar">{t("categories.nameAr")}</Label>
              <Input
                id="name_ar"
                value={formData.name_ar}
                onChange={(e) =>
                  setFormData({ ...formData, name_ar: e.target.value })
                }
                required
                dir={dir}
                className="input-luxury text-right"
              />
            </div>
            <div>
              <Label>{t("categories.image")}</Label>
              <ImageUpload
                value={formData.image_url}
                onChange={(urls) => setFormData({ ...formData, image_url: urls })}
                multiple={false}
                maxFiles={1}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {editingCategory ? t("common.update") : t("common.create")} {t("categories.title")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Categories;
