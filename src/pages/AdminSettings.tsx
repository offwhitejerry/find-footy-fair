import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { setPageTitle } from "@/lib/head";
import AdminMeta from "@/components/AdminMeta";

const AdminSettings = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setPageTitle("Admin - Settings");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AdminMeta />
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
            <h1 className="text-xl font-bold text-primary">Admin Settings</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Configure your application settings
            </p>
          </div>

          {/* Affiliate Tracking */}
          <Card className="p-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Affiliate Tracking</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seatgeek-affiliate">SeatGeek Affiliate ID</Label>
                  <Input
                    id="seatgeek-affiliate"
                    placeholder="your-affiliate-id"
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stubhub-affiliate">StubHub Affiliate ID</Label>
                  <Input
                    id="stubhub-affiliate"
                    placeholder="your-affiliate-id"
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                These settings are configured via environment variables on your deployment platform.
              </p>
            </div>
          </Card>

          {/* API Configuration */}
          <Card className="p-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">API Configuration</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seatgeek-api">SeatGeek API Key</Label>
                  <Input
                    id="seatgeek-api"
                    type="password"
                    placeholder="••••••••••••"
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api-timeout">API Timeout (ms)</Label>
                  <Input
                    id="api-timeout"
                    placeholder="5000"
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Display Settings */}
          <Card className="p-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Display Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="results-per-page">Results Per Page</Label>
                  <Input
                    id="results-per-page"
                    placeholder="20"
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cache-duration">Cache Duration (minutes)</Label>
                  <Input
                    id="cache-duration"
                    placeholder="15"
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Development Note */}
          <Card className="p-6 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
            <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Development Note</h3>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              These settings are currently read-only and configured through environment variables 
              on your deployment platform (Vercel, Netlify, etc.). In a future update, you'll be 
              able to modify these settings directly from this interface.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;