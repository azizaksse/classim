import { useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin-new/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  MoreHorizontal,
  Trash2,
  Grid3X3,
  List,
  Package,
  Edit,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProducts } from "@/hooks/admin/useProducts";
import { AddProductForm } from "@/components/admin-new/products/AddProductForm";
import { useAdminLanguage } from "@/contexts/AdminLanguageContext";

const Products = () => {
  const { t } = useAdminLanguage();
  const [view, setView] = useState<"grid" | "table">("table");
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const { products, isLoading, addProduct, updateProduct, deleteProduct, getTotalStock } =
    useProducts();

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const getStockStatus = (stock: number) => {
    if (stock === 0) return "out-of-stock";
    if (stock < 10) return "low-stock";
    return "in-stock";
  };
  const getStockLabel = (status: "in-stock" | "low-stock" | "out-of-stock") => {
    if (status === "in-stock") return t("products.inStock");
    if (status === "low-stock") return t("products.lowStock");
    return t("products.outOfStock");
  };

  const statusStyles = {
    "in-stock": "bg-success/10 text-success border-success/20",
    "low-stock": "bg-warning/10 text-warning border-warning/20",
    "out-of-stock": "bg-destructive/10 text-destructive border-destructive/20",
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-muted-foreground">{t("common.loading")}</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-semibold tracking-tight">
              {t("products.title")}
            </h1>
            <p className="text-muted-foreground mt-1">
              {products.length} {t("products.inventoryCount")}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link to="/admin/categories">
                <Plus className="h-4 w-4 mr-2" />
                {t("products.addCategory")}
              </Link>
            </Button>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t("products.addProduct")}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("common.searchProducts")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 input-luxury"
            />
          </div>
          <div className="flex border border-border rounded-lg overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("table")}
              className={cn("rounded-none", view === "table" && "bg-secondary")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("grid")}
              className={cn("rounded-none", view === "grid" && "bg-secondary")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Empty State */}
        {products.length === 0 ? (
          <div className="card-luxury p-12 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-heading text-xl font-medium mb-2">
              {t("products.none")}
            </h3>
            <p className="text-muted-foreground mb-6">
              {t("products.noneSub")}
            </p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t("products.addProduct")}
            </Button>
          </div>
        ) : view === "table" ? (
          <div className="card-luxury overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[300px]">{t("products.product")}</TableHead>
                  <TableHead>{t("products.category")}</TableHead>
                  <TableHead>{t("products.price")}</TableHead>
                  <TableHead>{t("products.variants")}</TableHead>
                  <TableHead>{t("products.stock")}</TableHead>
                  <TableHead>{t("products.status")}</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product, index) => {
                  const totalStock = getTotalStock(product);
                  const status = getStockStatus(totalStock);
                  return (
                    <TableRow
                      key={product.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-lg bg-secondary overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {product.category}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatPrice(product.price)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {product.variants.slice(0, 3).map((v, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-xs"
                            >
                              {v.size}/{v.color}
                            </Badge>
                          ))}
                          {product.variants.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{product.variants.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{totalStock}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn("capitalize", statusStyles[status])}
                        >
                          {getStockLabel(status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setEditingProduct(product)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              {t("common.edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => deleteProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              {t("common.delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product, index) => {
              const totalStock = getTotalStock(product);
              const status = getStockStatus(totalStock);
              return (
                <div
                  key={product.id}
                  className="card-luxury hover-lift overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="aspect-square bg-secondary relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                    <Badge
                      variant="outline"
                      className={cn(
                        "absolute top-3 right-3 capitalize",
                        statusStyles[status]
                      )}
                    >
                      {getStockLabel(status)}
                    </Badge>
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-background/80 hover:bg-accent"
                        onClick={() => setEditingProduct(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-background/80 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => deleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <p className="font-medium truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.category}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {product.variants.slice(0, 2).map((v, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {v.size}/{v.color}
                        </Badge>
                      ))}
                      {product.variants.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{product.variants.length - 2}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-heading text-lg font-semibold">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {totalStock} {t("products.stockLabel")}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AddProductForm
        open={showAddForm}
        onOpenChange={setShowAddForm}
        onSubmit={addProduct}
      />

      <AddProductForm
        key={editingProduct?.id}
        open={!!editingProduct}
        onOpenChange={(open) => !open && setEditingProduct(null)}
        product={editingProduct}
        onSubmit={(updates) => {
          updateProduct({ id: editingProduct.id, updates });
          setEditingProduct(null);
        }}
      />
    </AdminLayout>
  );
};

export default Products;
