import { cn } from "@/lib/utils";

const products = [
  {
    name: "Silk Evening Gown",
    category: "Dresses",
    sales: 245,
    revenue: "$600,250",
    image: "/placeholder.svg",
    trending: true,
  },
  {
    name: "Italian Leather Loafers",
    category: "Shoes",
    sales: 189,
    revenue: "$168,210",
    image: "/placeholder.svg",
    trending: true,
  },
  {
    name: "Cashmere Blend Coat",
    category: "Outerwear",
    sales: 156,
    revenue: "$234,000",
    image: "/placeholder.svg",
    trending: false,
  },
  {
    name: "Diamond Tennis Bracelet",
    category: "Jewelry",
    sales: 98,
    revenue: "$490,000",
    image: "/placeholder.svg",
    trending: true,
  },
];

export function TopProducts() {
  return (
    <div className="card-luxury p-6">
      <div className="mb-6">
        <h3 className="font-heading text-lg font-semibold">Top Products</h3>
        <p className="text-sm text-muted-foreground">
          Best performing items this month
        </p>
      </div>
      <div className="space-y-4">
        {products.map((product, index) => (
          <div
            key={product.name}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/30 transition-colors group animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative">
              <div className="h-14 w-14 rounded-lg bg-secondary overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              {product.trending && (
                <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent flex items-center justify-center">
                  <span className="text-[10px] text-accent-foreground">🔥</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate group-hover:text-accent transition-colors">
                {product.name}
              </p>
              <p className="text-xs text-muted-foreground">{product.category}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-sm">{product.revenue}</p>
              <p className="text-xs text-muted-foreground">{product.sales} sales</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
