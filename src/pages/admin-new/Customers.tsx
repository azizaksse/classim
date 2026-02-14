import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
  Mail,
  Filter,
  Download,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminLanguage } from "@/contexts/AdminLanguageContext";

const statusStyles = {
  active: "bg-success/10 text-success border-success/20",
  new: "bg-info/10 text-info border-info/20",
};

const Customers = () => {
  const { t } = useAdminLanguage();
  const [search, setSearch] = useState("");

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      const now = Date.now();
      return data.map((p: any) => {
        const createdAt = new Date(p.created_at);
        const isNew = now - createdAt.getTime() < 1000 * 60 * 60 * 24 * 30;
        return {
          id: p.id,
          name: p.full_name || "-",
          email: p.email || "-",
          phone: p.phone || "—",
          status: isNew ? "new" : "active",
          joinDate: createdAt.toLocaleDateString(),
        };
      });
    },
  });

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase())
  );

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
              {t("customers.title")}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t("customers.subtitle")}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              {t("customers.export")}
            </Button>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <UserPlus className="h-4 w-4 mr-2" />
              {t("customers.addCustomer")}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card-luxury p-4">
            <p className="text-sm text-muted-foreground">{t("customers.total")}</p>
            <p className="text-2xl font-heading font-semibold mt-1">
              {customers.length}
            </p>
          </div>
          <div className="card-luxury p-4">
            <p className="text-sm text-muted-foreground">{t("customers.newThisMonth")}</p>
            <p className="text-2xl font-heading font-semibold mt-1">
              {customers.filter((c) => c.status === "new").length}
            </p>
          </div>
          <div className="card-luxury p-4">
            <p className="text-sm text-muted-foreground">{t("customers.withEmail")}</p>
            <p className="text-2xl font-heading font-semibold mt-1">
              {customers.filter((c) => c.email && c.email !== "-").length}
            </p>
          </div>
          <div className="card-luxury p-4">
            <p className="text-sm text-muted-foreground">{t("customers.withPhone")}</p>
            <p className="text-2xl font-heading font-semibold mt-1">
              {customers.filter((c) => c.phone && c.phone !== "—").length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("common.searchCustomers")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 input-luxury"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            {t("customers.filters")}
          </Button>
        </div>

        {/* Customers Table */}
        <div className="card-luxury overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>{t("customers.customer")}</TableHead>
                <TableHead>{t("customers.phone")}</TableHead>
                <TableHead>{t("customers.status")}</TableHead>
                <TableHead>{t("customers.joinDate")}</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer, index) => (
                <TableRow
                  key={customer.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-border">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-accent/10 text-accent">
                          {customer.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {customer.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {customer.phone}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "capitalize",
                        statusStyles[customer.status as keyof typeof statusStyles]
                      )}
                    >
                      {customer.status === "new" ? t("common.new") : t("common.active")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {customer.joinDate}
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
                          {t("customers.viewProfile")}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" />
                          {t("customers.sendEmail")}
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

export default Customers;
