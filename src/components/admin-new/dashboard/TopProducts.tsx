interface TopProductsProps {
  products: any[];
  isLoading?: boolean;
}

const formatPrice = (value?: number | null) => {
  if (value === null || value === undefined) return "—";
  return `${new Intl.NumberFormat("fr-DZ").format(value)} DA`;
};

export function TopProducts({ products, isLoading }: TopProductsProps) {
  const sorted = [...(products || [])].sort((a, b) => {
    const aFeatured = a.is_featured ? 1 : 0;
    const bFeatured = b.is_featured ? 1 : 0;
    if (aFeatured !== bFeatured) return bFeatured - aFeatured;
    return 0;
  });
  const top = sorted.slice(0, 4);

  return (
    <div className="card-luxury p-6">
      <div className="mb-6">
        <h3 className="font-heading text-lg font-semibold">Latest Products</h3>
        <p className="text-sm text-muted-foreground">
          Recently added or featured products
        </p>
      </div>
      {isLoading ? (
        <div className="py-6 text-sm text-muted-foreground">Loading...</div>
      ) : top.length === 0 ? (
        <div className="py-6 text-sm text-muted-foreground">
          No products yet
        </div>
      ) : (
        <div className="space-y-4">
          {top.map((product, index) => (
            <div
              key={product._id || product.id || `${product.name_fr}-${index}`}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/30 transition-colors group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="h-14 w-14 rounded-lg bg-secondary overflow-hidden">
                <img
                  src={product.images?.[0] || "/placeholder.svg"}
                  alt={product.name_fr || product.name_ar || "Product"}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate group-hover:text-accent transition-colors">
                  {product.name_fr || product.name_ar || "Untitled"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {product.category_name || "Uncategorized"}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm">
                  {formatPrice(product.sale_price ?? product.rent_price)}
                </p>
                <p className="text-xs text-muted-foreground">Price</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
