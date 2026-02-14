import { useQuery as useConvexQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin-new/layout/AdminLayout";
import { MetricCard } from "@/components/admin-new/dashboard/MetricCard";
import { RevenueChart } from "@/components/admin-new/dashboard/RevenueChart";
import { RecentCustomers } from "@/components/admin-new/dashboard/RecentOrders";
import { TopProducts } from "@/components/admin-new/dashboard/TopProducts";
import { FolderOpen, Users, Package, CheckCircle2 } from "lucide-react";

const Dashboard = () => {
  const productsData = useConvexQuery(api.products.get);
  const categoriesData = useConvexQuery(api.categories.get);

  const productsLoading = productsData === undefined;
  const categoriesLoading = categoriesData === undefined;

  const products = productsData || [];
  const categories = categoriesData || [];

  const activeProductsCount = products.filter(
    (p: any) => p.is_active !== false
  ).length;

  const { data: usersCount = 0, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: recentCustomers = [], isLoading: recentCustomersLoading } = useQuery({
    queryKey: ["admin-recent-customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return (data || []).map((row: any) => ({
        id: row.id,
        name: row.full_name || "Anonymous",
        email: row.email || "No email",
        created_at: row.created_at,
      }));
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-6 md:space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <h1 className="text-2xl font-heading font-semibold tracking-tight sm:text-3xl">
            Dashboard
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Products"
            value={productsLoading ? "..." : products.length.toString()}
            icon={<Package className="h-5 w-5" />}
          />
          <MetricCard
            title="Active Products"
            value={productsLoading ? "..." : activeProductsCount.toString()}
            icon={<CheckCircle2 className="h-5 w-5" />}
          />
          <MetricCard
            title="Total Customers"
            value={usersLoading ? "..." : usersCount.toString()}
            icon={<Users className="h-5 w-5" />}
          />
          <MetricCard
            title="Categories"
            value={categoriesLoading ? "..." : categories.length.toString()}
            icon={<FolderOpen className="h-5 w-5" />}
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 xl:grid-cols-3">
          <div className="lg:col-span-2">
            <RevenueChart
              categories={categories}
              products={products}
              isLoading={categoriesLoading || productsLoading}
            />
          </div>
          <TopProducts products={products} isLoading={productsLoading} />
        </div>

        {/* Recent Orders */}
        <RecentCustomers customers={recentCustomers} isLoading={recentCustomersLoading} />
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
