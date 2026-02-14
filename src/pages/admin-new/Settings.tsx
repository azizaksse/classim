import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { AdminLayout } from "@/components/admin-new/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Store,
  Bell,
  Shield,
  Camera,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WILAYAS } from "@/constants/wilayas";

const DEFAULT_HERO_BRAND = "Classimo";
const DEFAULT_HERO_TITLE = "Location & Vente de Costumes de Mariage";
const DEFAULT_HERO_SUBTITLE = "Modeles premium • Tailles variees • Commande rapide et securisee";

const Settings = () => {
  const { toast } = useToast();
  const storeSettings = useQuery(api.settings.get);
  const upsertStoreSettings = useMutation(api.settings.upsertStoreSettings);
  const [deliveryPrice, setDeliveryPrice] = useState("0");
  const [deliveryPricesByWilaya, setDeliveryPricesByWilaya] = useState<Record<string, string>>({});
  const [facebookPixelsText, setFacebookPixelsText] = useState("");
  const [announcementEnabled, setAnnouncementEnabled] = useState(false);
  const [announcementTextAr, setAnnouncementTextAr] = useState("");
  const [announcementTextFr, setAnnouncementTextFr] = useState("");
  const [heroBrandText, setHeroBrandText] = useState("");
  const [heroTitleText, setHeroTitleText] = useState("");
  const [heroSubtitleText, setHeroSubtitleText] = useState("");

  useEffect(() => {
    if (storeSettings) {
      setDeliveryPrice(String(storeSettings.delivery_price ?? 0));
      const mappedValues: Record<string, string> = {};
      for (const w of WILAYAS) {
        const value = storeSettings.delivery_prices_by_wilaya?.[w.code];
        mappedValues[w.code] = value === undefined ? "" : String(value);
      }
      setDeliveryPricesByWilaya(mappedValues);
      setFacebookPixelsText((storeSettings.facebook_pixels ?? []).join("\n"));
      setAnnouncementEnabled(Boolean(storeSettings.announcement_enabled));
      setAnnouncementTextAr(storeSettings.announcement_text_ar ?? "");
      setAnnouncementTextFr(storeSettings.announcement_text_fr ?? "");
      setHeroBrandText((storeSettings.hero_brand_text ?? "").trim() || DEFAULT_HERO_BRAND);
      setHeroTitleText((storeSettings.hero_title_text ?? "").trim() || DEFAULT_HERO_TITLE);
      setHeroSubtitleText((storeSettings.hero_subtitle_text ?? "").trim() || DEFAULT_HERO_SUBTITLE);
    }
  }, [storeSettings]);

  const onWilayaPriceChange = (code: string, value: string) => {
    setDeliveryPricesByWilaya((prev) => ({
      ...prev,
      [code]: value,
    }));
  };

  const saveStoreSettings = async () => {
    const parsedPrice = Number(deliveryPrice);
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      toast({
        title: "Invalid delivery price",
        description: "Please enter a valid positive number.",
        variant: "destructive",
      });
      return;
    }

    const parsedByWilaya: Record<string, number> = {};
    for (const w of WILAYAS) {
      const rawValue = deliveryPricesByWilaya[w.code]?.trim();
      if (!rawValue) {
        continue;
      }

      const parsed = Number(rawValue);
      if (!Number.isFinite(parsed) || parsed < 0) {
        toast({
          title: "Invalid wilaya delivery price",
          description: `Please enter a valid price for wilaya ${w.code}.`,
          variant: "destructive",
        });
        return;
      }

      parsedByWilaya[w.code] = parsed;
    }

    const facebookPixels = Array.from(
      new Set(
        facebookPixelsText
          .split(/[\n,]+/)
          .map((id) => id.trim())
          .filter(Boolean)
      )
    );

    try {
      await upsertStoreSettings({
        delivery_price: parsedPrice,
        delivery_prices_by_wilaya: parsedByWilaya,
        facebook_pixels: facebookPixels,
        announcement_enabled: announcementEnabled,
        announcement_text_ar: announcementTextAr.trim(),
        announcement_text_fr: announcementTextFr.trim(),
        hero_brand_text: heroBrandText.trim(),
        hero_title_text: heroTitleText.trim(),
        hero_subtitle_text: heroSubtitleText.trim(),
      });
      toast({
        title: "Settings saved",
        description: "Store and homepage settings have been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to save settings",
        description: error?.message ?? "Unknown error",
        variant: "destructive",
      });
    }
  };

  const currentDeliveryPrice = storeSettings?.delivery_price ?? (Number(deliveryPrice) || 0);

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-heading font-semibold tracking-tight">
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and store preferences
          </p>
        </div>

        <Card className="card-luxury">
          <CardHeader className="pb-3">
            <CardTitle className="font-heading">Delivery Price</CardTitle>
            <CardDescription>Visible quick view for your current store delivery fee</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="inline-flex items-center gap-2 rounded-lg bg-accent/10 px-4 py-2">
              <span className="text-sm text-muted-foreground">Current:</span>
              <span className="text-lg font-semibold text-accent">{currentDeliveryPrice.toLocaleString()} DA</span>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="store" className="space-y-6">
          <TabsList className="bg-secondary/50 p-1">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="store" className="gap-2">
              <Store className="h-4 w-4" />
              Store
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="font-heading">Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and profile picture
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24 border-2 border-accent/20">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-accent text-accent-foreground text-2xl font-heading">
                      AK
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG or GIF. Max size 2MB
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Form Fields */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input defaultValue="Admin" className="input-luxury" />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input defaultValue="User" className="input-luxury" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Email Address</Label>
                    <Input
                      type="email"
                      defaultValue="admin@classimo.com"
                      className="input-luxury"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Phone Number</Label>
                    <Input
                      type="tel"
                      defaultValue="+1 (555) 123-4567"
                      className="input-luxury"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Store Tab */}
          <TabsContent value="store" className="space-y-6">
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="font-heading">Store Settings</CardTitle>
                <CardDescription>
                  Configure your store details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Store Name</Label>
                    <Input defaultValue="Classimo Smart Fit" className="input-luxury" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Store Description</Label>
                    <Input
                      defaultValue="Luxury fashion and accessories"
                      className="input-luxury"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Input defaultValue="USD ($)" className="input-luxury" />
                  </div>
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Input defaultValue="America/New_York" className="input-luxury" />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Delivery Pricing</h4>
                  <div className="space-y-2 max-w-sm">
                    <div className="space-y-2">
                      <Label htmlFor="delivery_price">Delivery Price (DA)</Label>
                      <Input
                        id="delivery_price"
                        type="number"
                        min={0}
                        step="1"
                        className="input-luxury"
                        value={deliveryPrice}
                        onChange={(e) => setDeliveryPrice(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Default price used when a wilaya-specific price is empty.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium">Price By Wilaya (DA)</h5>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {WILAYAS.map((w) => (
                        <div key={w.code} className="space-y-1">
                          <Label htmlFor={`delivery_price_${w.code}`} className="text-xs">
                            {w.code} - {w.nameFr}
                          </Label>
                          <Input
                            id={`delivery_price_${w.code}`}
                            type="number"
                            min={0}
                            step="1"
                            className="input-luxury"
                            value={deliveryPricesByWilaya[w.code] ?? ""}
                            onChange={(e) => onWilayaPriceChange(w.code, e.target.value)}
                            placeholder={deliveryPrice || "0"}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Facebook Pixel IDs</h4>
                  <div className="space-y-2">
                    <Label htmlFor="facebook_pixels">
                      Pixel IDs (one per line or comma separated)
                    </Label>
                    <Textarea
                      id="facebook_pixels"
                      value={facebookPixelsText}
                      onChange={(e) => setFacebookPixelsText(e.target.value)}
                      className="input-luxury min-h-[110px]"
                      placeholder={"123456789012345\n987654321098765"}
                    />
                    <p className="text-xs text-muted-foreground">
                      Add multiple Facebook Pixel IDs to track all client ad accounts.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Announcement Bar</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Show top announcement line</p>
                      <p className="text-sm text-muted-foreground">
                        Display a line above the navbar on all website pages.
                      </p>
                    </div>
                    <Switch checked={announcementEnabled} onCheckedChange={setAnnouncementEnabled} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="announcement_text_ar">Text (Arabic)</Label>
                      <Input
                        id="announcement_text_ar"
                        value={announcementTextAr}
                        onChange={(e) => setAnnouncementTextAr(e.target.value)}
                        className="input-luxury"
                        dir="rtl"
                        placeholder="📦 التوصيل لجميع الولايات dz"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="announcement_text_fr">Text (French)</Label>
                      <Input
                        id="announcement_text_fr"
                        value={announcementTextFr}
                        onChange={(e) => setAnnouncementTextFr(e.target.value)}
                        className="input-luxury"
                        placeholder="📦 Livraison vers toutes les wilayas DZ"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Homepage Hero Text</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="hero_brand_text">Logo Label</Label>
                      <Input
                        id="hero_brand_text"
                        value={heroBrandText}
                        onChange={(e) => setHeroBrandText(e.target.value)}
                        className="input-luxury"
                        placeholder="Classimo"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="hero_title_text">Hero Title</Label>
                      <Input
                        id="hero_title_text"
                        value={heroTitleText}
                        onChange={(e) => setHeroTitleText(e.target.value)}
                        className="input-luxury"
                        placeholder="Location & Vente de Costumes de Mariage"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="hero_subtitle_text">Hero Subtitle</Label>
                      <Textarea
                        id="hero_subtitle_text"
                        value={heroSubtitleText}
                        onChange={(e) => setHeroSubtitleText(e.target.value)}
                        className="input-luxury min-h-[90px]"
                        placeholder="Modeles premium • Tailles variees • Commande rapide et securisee"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Store Features</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Enable Reviews</p>
                        <p className="text-sm text-muted-foreground">
                          Allow customers to leave product reviews
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Inventory Alerts</p>
                        <p className="text-sm text-muted-foreground">
                          Get notified when stock is low
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Gift Wrapping</p>
                        <p className="text-sm text-muted-foreground">
                          Offer gift wrapping service
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={saveStoreSettings}
                  >
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="font-heading">Notification Preferences</CardTitle>
                <CardDescription>
                  Choose what notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Email Notifications</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">New Orders</p>
                        <p className="text-sm text-muted-foreground">
                          Receive an email for every new order
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Low Stock Alerts</p>
                        <p className="text-sm text-muted-foreground">
                          Get notified when products are running low
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Customer Reviews</p>
                        <p className="text-sm text-muted-foreground">
                          Email when a customer leaves a review
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Weekly Reports</p>
                        <p className="text-sm text-muted-foreground">
                          Receive weekly sales summary
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Push Notifications</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Real-time Alerts</p>
                        <p className="text-sm text-muted-foreground">
                          Get instant push notifications
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="font-heading">Security Settings</CardTitle>
                <CardDescription>
                  Manage your password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Change Password</h4>
                  <div className="grid gap-4 max-w-md">
                    <div className="space-y-2">
                      <Label>Current Password</Label>
                      <Input type="password" className="input-luxury" />
                    </div>
                    <div className="space-y-2">
                      <Label>New Password</Label>
                      <Input type="password" className="input-luxury" />
                    </div>
                    <div className="space-y-2">
                      <Label>Confirm New Password</Label>
                      <Input type="password" className="input-luxury" />
                    </div>
                  </div>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Update Password
                  </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <div className="flex items-center justify-between max-w-md">
                    <div>
                      <p className="font-medium text-sm">Enable 2FA</p>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Session Management</h4>
                  <div className="p-4 rounded-lg bg-secondary/30 max-w-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Current Session</p>
                        <p className="text-xs text-muted-foreground">
                          Chrome on macOS • Active now
                        </p>
                      </div>
                      <Badge className="bg-success/10 text-success border-success/20">
                        Current
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="text-destructive">
                    Sign Out All Other Sessions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Settings;
