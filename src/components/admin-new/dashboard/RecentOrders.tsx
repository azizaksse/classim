import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const orders = [
  {
    id: "ORD-001",
    customer: "Sarah Johnson",
    email: "sarah@example.com",
    product: "Silk Evening Gown",
    amount: "$2,450",
    status: "delivered",
    date: "2 hours ago",
  },
  {
    id: "ORD-002",
    customer: "Michael Chen",
    email: "michael@example.com",
    product: "Italian Leather Shoes",
    amount: "$890",
    status: "shipped",
    date: "5 hours ago",
  },
  {
    id: "ORD-003",
    customer: "Emma Williams",
    email: "emma@example.com",
    product: "Cashmere Sweater",
    amount: "$450",
    status: "processing",
    date: "1 day ago",
  },
  {
    id: "ORD-004",
    customer: "James Brown",
    email: "james@example.com",
    product: "Designer Watch",
    amount: "$5,200",
    status: "pending",
    date: "1 day ago",
  },
  {
    id: "ORD-005",
    customer: "Olivia Davis",
    email: "olivia@example.com",
    product: "Silk Scarf Collection",
    amount: "$320",
    status: "delivered",
    date: "2 days ago",
  },
];

const statusStyles = {
  pending: "bg-warning/10 text-warning border-warning/20",
  processing: "bg-info/10 text-info border-info/20",
  shipped: "bg-accent/10 text-accent border-accent/20",
  delivered: "bg-success/10 text-success border-success/20",
};

export function RecentOrders() {
  return (
    <div className="card-luxury p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-heading text-lg font-semibold">Recent Orders</h3>
          <p className="text-sm text-muted-foreground">
            Latest transactions from your store
          </p>
        </div>
        <a
          href="/orders"
          className="text-sm text-accent hover:text-accent/80 transition-colors"
        >
          View all →
        </a>
      </div>
      <div className="space-y-4">
        {orders.map((order, index) => (
          <div
            key={order.id}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10 border border-border">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-accent/10 text-accent text-sm">
                  {order.customer
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{order.customer}</p>
                <p className="text-xs text-muted-foreground">{order.product}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold text-sm">{order.amount}</p>
                <p className="text-xs text-muted-foreground">{order.date}</p>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "capitalize text-xs",
                  statusStyles[order.status as keyof typeof statusStyles]
                )}
              >
                {order.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
