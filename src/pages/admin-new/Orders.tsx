import { useState, useMemo } from "react";
import { AdminLayout } from "@/components/admin-new/layout/AdminLayout";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Loader2,
  Package,
  ShoppingCart,
  TrendingUp,
  AlertCircle,
  MoreHorizontal,
  Trash2,
  Check,
  X,
  RefreshCw
} from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import OrdersReportPDF from "@/components/admin-new/OrdersReportPDF";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useAdminLanguage } from "@/contexts/AdminLanguageContext";

const Orders = () => {
  const { t } = useAdminLanguage();
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month" | "all">("today");

  // Calculate Date Ranges
  const dateRange = useMemo(() => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();

    if (timeRange === "today") {
      return { from: startOfDay, to: endOfDay };
    }
    if (timeRange === "week") {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      return { from: startOfWeek.getTime(), to: endOfDay };
    }
    if (timeRange === "month") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
      return { from: startOfMonth, to: endOfDay };
    }
    return { from: 0, to: endOfDay }; // All time
  }, [timeRange]);

  // Fetch Data
  const stats = useQuery(api.orders.getDashboardStats, {
    from: dateRange.from,
    to: dateRange.to,
  });

  const orders = useQuery(api.orders.getOrders, {
    from: dateRange.from,
    to: dateRange.to,
    limit: 100, // Limit to 100 for performance in this view
  });

  const updateStatus = useMutation(api.orders.updateStatus);
  const deleteOrder = useMutation(api.orders.deleteOrder);
  const resyncOrder = useAction(api.orders.resyncOrder);
  const [updatingId, setUpdatingId] = useState<Id<"orders"> | null>(null);
  const [isResyncing, setIsResyncing] = useState<string | null>(null);

  const handleStatusChange = async (orderId: Id<"orders">, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await updateStatus({ orderId, status: newStatus as any });
      toast.success(t("orders.statusUpdated"));
    } catch (error) {
      toast.error(t("orders.statusUpdateFailed"));
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleResync = async (orderId: Id<"orders">) => {
    setIsResyncing(orderId);
    try {
      await resyncOrder({ orderId });
      toast.success(t("orders.resyncQueued"));
    } catch (error) {
      toast.error(t("orders.resyncFailed"));
      console.error(error);
    } finally {
      setIsResyncing(null);
    }
  };

  const handleDelete = async (orderId: Id<"orders">) => {
    try {
      await deleteOrder({ orderId });
      toast.success(t("orders.deleted"));
    } catch (error) {
      toast.error(t("orders.deleteFailed"));
      console.error(error);
    }
  };

  const isLoading = !stats || !orders;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-DZ", {
      style: "currency",
      currency: "DZD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "delivered":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "processing":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in pb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-semibold tracking-tight">
              {t("orders.title")}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t("orders.subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isLoading && orders && stats && (
              <PDFDownloadLink
                document={
                  <OrdersReportPDF
                    orders={orders}
                    stats={stats}
                    dateRange={timeRange.toUpperCase()}
                  />
                }
                fileName={`orders_report_${timeRange}_${new Date().toISOString().split('T')[0]}.pdf`}
              >
                {({ loading }) => (
                  <Button variant="outline" className="gap-2" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    {t("orders.exportPdf")}
                  </Button>
                )}
              </PDFDownloadLink>
            )}
          </div>
        </div>

        {/* Filters */}
        <Tabs
          defaultValue="today"
          value={timeRange}
          onValueChange={(val) => setTimeRange(val as any)}
          className="w-full"
        >
          <TabsList>
            <TabsTrigger value="today">{t("orders.today")}</TabsTrigger>
            <TabsTrigger value="week">{t("orders.week")}</TabsTrigger>
            <TabsTrigger value="month">{t("orders.month")}</TabsTrigger>
            <TabsTrigger value="all">{t("orders.allTime")}</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("orders.totalOrders")}</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 w-24 skeleton rounded" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.verifiedOrders} {t("orders.confirmed")}, {stats?.cancelledOrders} {t("orders.cancelled")}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("orders.revenue")}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 w-24 skeleton rounded" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {formatCurrency(stats?.totalRevenue || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("orders.revenueSub")}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("orders.avgOrderValue")}</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 w-24 skeleton rounded" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {formatCurrency(stats?.averageOrderValue || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("orders.avgSub")}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>{t("orders.recentOrders")}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : orders && orders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-start">{t("orders.customer")}</TableHead>
                    <TableHead className="text-start">{t("orders.product")}</TableHead>
                    <TableHead className="text-start">{t("orders.location")}</TableHead>
                    <TableHead className="text-start">{t("orders.date")}</TableHead>
                    <TableHead className="text-center">{t("orders.status")}</TableHead>
                    <TableHead className="text-center">{t("orders.items")}</TableHead>
                    <TableHead className="text-center">{t("orders.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="text-start">
                        <div className="font-medium">{order.customer_name}</div>
                        <div className="text-xs text-muted-foreground">{order.phone}</div>
                      </TableCell>
                      <TableCell className="text-start">
                        <div className="font-medium">{order.product_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {order.color} / {order.size}
                        </div>
                      </TableCell>
                      <TableCell className="text-start">
                        <div className="text-sm">{order.city}</div>
                        <div className="text-xs text-muted-foreground">{order.wilaya_name}</div>
                      </TableCell>
                      <TableCell className="text-start">
                        <div className="text-sm">
                          {new Date(order._creationTime).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(order._creationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Select
                            defaultValue={order.status || 'pending'}
                            onValueChange={(val) => handleStatusChange(order._id, val)}
                            disabled={updatingId === order._id}
                          >
                            <SelectTrigger className={`w-[130px] h-8 ${getStatusColor(order.status || 'pending')}`}>
                              <SelectValue placeholder={t("orders.status")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">{t("orders.pending")}</SelectItem>
                              <SelectItem value="confirmed">{t("orders.confirmed")}</SelectItem>
                              <SelectItem value="approved">{t("orders.approved")}</SelectItem>
                              <SelectItem value="processing">{t("orders.processing")}</SelectItem>
                              <SelectItem value="delivered">{t("orders.delivered")}</SelectItem>
                              <SelectItem value="cancelled">{t("orders.cancelled")}</SelectItem>
                            </SelectContent>
                          </Select>
                          {updatingId === order._id && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {order.quantity}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          {order.syncStatus === "failed" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                              onClick={() => handleResync(order._id)}
                              disabled={isResyncing === order._id}
                              title={t("orders.resyncTitle")}
                            >
                              {isResyncing === order._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                            </Button>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{t("orders.deleteTitle")}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t("orders.deleteDescription")}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(order._id)} className="bg-destructive hover:bg-destructive/90">
                                  {t("common.delete")}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">{t("orders.noOrders")}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("orders.noOrdersSub")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>      </div>
    </AdminLayout >
  );
};

export default Orders;
