import { useAdminLanguage } from "@/contexts/AdminLanguageContext";

interface CategoryBreakdownProps {
  categories: any[];
  products: any[];
  isLoading?: boolean;
}

export function RevenueChart({ categories, products, isLoading }: CategoryBreakdownProps) {
  const { t } = useAdminLanguage();
  const counts = (categories || []).map((category) => {
    const count = (products || []).filter(
      (p: any) => p.category_id === category._id
    ).length;
    return {
      id: category._id,
      name: category.name_fr || category.name_ar || t("dashboard.uncategorized"),
      count,
    };
  });

  const uncategorizedCount = (products || []).filter(
    (p: any) => !p.category_id
  ).length;

  if (uncategorizedCount > 0) {
    counts.push({
      id: "uncategorized",
      name: t("dashboard.uncategorized"),
      count: uncategorizedCount,
    });
  }

  const maxCount = Math.max(1, ...counts.map((c) => c.count));

  return (
    <div className="card-luxury p-4 sm:p-5 lg:p-6">
      <div className="mb-4 sm:mb-6">
        <h3 className="font-heading text-lg font-semibold">
          {t("dashboard.productsByCategory")}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t("dashboard.productsByCategorySub")}
        </p>
      </div>
      {isLoading ? (
        <div className="py-6 text-sm text-muted-foreground">{t("common.loading")}</div>
      ) : counts.length === 0 ? (
        <div className="py-6 text-sm text-muted-foreground">
          {t("dashboard.noCategories")}
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
