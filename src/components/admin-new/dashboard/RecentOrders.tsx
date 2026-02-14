import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface RecentCustomer {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

interface RecentCustomersProps {
  customers: RecentCustomer[];
  isLoading?: boolean;
}

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
};

export function RecentCustomers({ customers, isLoading }: RecentCustomersProps) {
  return (
    <div className="card-luxury p-4 sm:p-5 lg:p-6">
      <div className="mb-4 flex items-center justify-between sm:mb-6">
        <div>
          <h3 className="font-heading text-lg font-semibold">
            Recent Customers
          </h3>
          <p className="text-sm text-muted-foreground">
            Latest signups from your store
          </p>
        </div>
        <a
          href="/admin/customers"
          className="text-sm text-accent hover:text-accent/80 transition-colors"
        >
          View all →
        </a>
      </div>
      {isLoading ? (
        <div className="py-6 text-sm text-muted-foreground">Loading...</div>
      ) : customers.length === 0 ? (
        <div className="py-6 text-sm text-muted-foreground">
          No customers yet
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {customers.map((customer, index) => (
            <div
              key={customer.id}
              className="flex items-center justify-between gap-3 rounded-lg bg-secondary/30 p-2.5 transition-colors hover:bg-secondary/50 animate-fade-in sm:p-3"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-accent/10 text-accent text-sm">
                    {customer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{customer.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {customer.email}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm">Joined</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(customer.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
