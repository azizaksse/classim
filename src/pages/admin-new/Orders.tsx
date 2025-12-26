import { useState } from "react";
import { AdminLayout } from "@/components/admin-new/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  MoreHorizontal,
  Eye,
  Package,
  Filter,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

const orders = [
  {
    id: "ORD-2024-001",
    customer: "Sarah Johnson",
    email: "sarah@example.com",
    products: 3,
    total: "$4,890",
    status: "delivered",
    date: "Dec 24, 2024",
    paymentStatus: "paid",
  },
  {
    id: "ORD-2024-002",
    customer: "Michael Chen",
    email: "michael@example.com",
    products: 1,
    total: "$890",
    status: "shipped",
    date: "Dec 23, 2024",
    paymentStatus: "paid",
  },
  {
    id: "ORD-2024-003",
    customer: "Emma Williams",
    email: "emma@example.com",
    products: 2,
    total: "$1,750",
    status: "processing",
    date: "Dec 23, 2024",
    paymentStatus: "paid",
  },
  {
    id: "ORD-2024-004",
    customer: "James Brown",
    email: "james@example.com",
    products: 1,
    total: "$5,200",
    status: "pending",
    date: "Dec 22, 2024",
    paymentStatus: "pending",
  },
  {
    id: "ORD-2024-005",
    customer: "Olivia Davis",
    email: "olivia@example.com",
    products: 4,
    total: "$2,320",
    status: "delivered",
    date: "Dec 21, 2024",
    paymentStatus: "paid",
  },
  {
    id: "ORD-2024-006",
    customer: "William Taylor",
    email: "william@example.com",
    products: 2,
    total: "$3,100",
    status: "cancelled",
    date: "Dec 20, 2024",
    paymentStatus: "refunded",
  },
];

const statusStyles = {
  pending: "bg-warning/10 text-warning border-warning/20",
  processing: "bg-info/10 text-info border-info/20",
  shipped: "bg-accent/10 text-accent border-accent/20",
  delivered: "bg-success/10 text-success border-success/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

const paymentStyles = {
  paid: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  refunded: "bg-muted text-muted-foreground border-muted",
};

const statusPipeline = ["pending", "processing", "shipped", "delivered"];

const Orders = () => {
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !activeStatus || order.status === activeStatus;
    return matchesSearch && matchesStatus;
  });

  const orderCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-semibold tracking-tight">
              Orders
            </h1>
            <p className="text-muted-foreground mt-1">
              Track and manage customer orders
            </p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Orders
          </Button>
        </div>

        {/* Status Pipeline */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeStatus === null ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveStatus(null)}
            className={activeStatus === null ? "bg-accent text-accent-foreground" : ""}
          >
            All Orders ({orderCounts.all})
          </Button>
          {statusPipeline.map((status) => (
            <Button
              key={status}
              variant={activeStatus === status ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveStatus(status)}
              className={cn(
                "capitalize",
                activeStatus === status && "bg-accent text-accent-foreground"
              )}
            >
              {status} ({orderCounts[status as keyof typeof orderCounts]})
            </Button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 input-luxury"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Orders Table */}
        <div className="card-luxury overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order, index) => (
                <TableRow
                  key={order.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TableCell className="font-mono text-sm font-medium">
                    {order.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-accent/10 text-accent text-xs">
                          {order.customer
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{order.customer}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span>{order.products}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{order.total}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "capitalize",
                        statusStyles[order.status as keyof typeof statusStyles]
                      )}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "capitalize",
                        paymentStyles[order.paymentStatus as keyof typeof paymentStyles]
                      )}
                    >
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {order.date}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Package className="h-4 w-4 mr-2" />
                          Update Status
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Orders;
