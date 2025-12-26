import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin-new/layout/AdminLayout";
import { MetricCard } from "@/components/admin-new/dashboard/MetricCard";
import { RevenueChart } from "@/components/admin-new/dashboard/RevenueChart";
import { RecentOrders } from "@/components/admin-new/dashboard/RecentOrders";
import { TopProducts } from "@/components/admin-new/dashboard/TopProducts";
import { DollarSign, ShoppingCart, Users, Package } from "lucide-react";

const Dashboard = () => {
  const { data: productsCount = 0 } = useQuery({
    queryKey: ["admin-products-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: usersCount = 0 } = useQuery({
    queryKey: ["admin-users-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: categoriesCount = 0 } = useQuery({
    queryKey: ["admin-categories-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("categories")
        .select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-heading font-semibold tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Revenue"
            value="0 DA"
            change={0}
            changeLabel="vs last month"
            icon={<DollarSign className="h-5 w-5" />}
          />
          <MetricCard
            title="Total Products"
            value={productsCount.toString()}
            change={0}
            changeLabel="total items"
            icon={<Package className="h-5 w-5" />}
          />
          <MetricCard
            title="Total Customers"
            value={usersCount.toString()}
            change={0}
            changeLabel="registered users"
            icon={<Users className="h-5 w-5" />}
          />
          <MetricCard
            title="Categories"
            value={categoriesCount.toString()}
            change={0}
            changeLabel="active categories"
            icon={<ShoppingCart className="h-5 w-5" />}
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
          <TopProducts />
        </div>

        {/* Recent Orders */}
        <RecentOrders />
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
