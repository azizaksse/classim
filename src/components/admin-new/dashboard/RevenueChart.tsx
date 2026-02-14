interface CategoryBreakdownProps {
  categories: any[];
  products: any[];
  isLoading?: boolean;
}

export function RevenueChart({ categories, products, isLoading }: CategoryBreakdownProps) {
  const counts = (categories || []).map((category) => {
    const count = (products || []).filter(
      (p: any) => p.category_id === category._id
    ).length;
    return {
      id: category._id,
      name: category.name_fr || category.name_ar || "Uncategorized",
      count,
    };
  });

  const uncategorizedCount = (products || []).filter(
    (p: any) => !p.category_id
  ).length;

  if (uncategorizedCount > 0) {
    counts.push({
      id: "uncategorized",
      name: "Uncategorized",
      count: uncategorizedCount,
    });
  }

  const maxCount = Math.max(1, ...counts.map((c) => c.count));

  return (
    <div className="card-luxury p-6">
      <div className="mb-6">
        <h3 className="font-heading text-lg font-semibold">
          Products by Category
        </h3>
        <p className="text-sm text-muted-foreground">
          Live count based on your current catalog
        </p>
      </div>
      {isLoading ? (
        <div className="py-6 text-sm text-muted-foreground">Loading...</div>
      ) : counts.length === 0 ? (
        <div className="py-6 text-sm text-muted-foreground">
          No categories yet
        </div>
      ) : (
        <div className="space-y-3">
          {counts.map((item) => (
            <div key={item.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground">{item.name}</span>
                <span className="text-muted-foreground">{item.count}</span>
              </div>
              <div className="h-2 rounded-full bg-secondary/60 overflow-hidden">
                <div
                  className="h-full bg-accent"
                  style={{ width: `${(item.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
