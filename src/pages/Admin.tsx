import { useEffect } from "react";
import { ArrowLeft, Settings, Sparkles, Lock, LogOut, BarChart3, Users, Cog } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSeedSampleData } from "@/hooks/useEvents";
import { site } from "@/config/site";
import { setPageTitle } from "@/lib/head";
import { useToast } from "@/hooks/use-toast";
import { signOutAdmin } from "@/utils/adminAuth";
import AdminMeta from "@/components/AdminMeta";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const seedMutation = useSeedSampleData();
  
  // Check if sample data features should be visible
  const showSampleData = import.meta.env.DEV || import.meta.env.VITE_ENABLE_SAMPLE_DATA === 'true';
  
  useEffect(() => {
    setPageTitle("Admin Dashboard");
  }, []);

  const handleSeedData = async () => {
    try {
      await seedMutation.mutateAsync();
      toast({
        title: "Sample data loaded",
        description: "Football events and tickets have been added to the database.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load sample data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminMeta />
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-bold text-primary flex items-center gap-2">
                Admin Dashboard
                <Lock className="h-4 w-4" />
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={signOutAdmin} className="text-destructive hover:text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your application settings and monitor activity
            </p>
          </div>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/admin/clicks')}>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Clicks Analytics</h2>
                  <p className="text-sm text-muted-foreground">Track affiliate clicks and conversions</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/admin/providers')}>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Providers</h2>
                  <p className="text-sm text-muted-foreground">Manage ticket providers and settings</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/admin/settings')}>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Cog className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Settings</h2>
                  <p className="text-sm text-muted-foreground">Configure application settings</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Branding Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Branding</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground mb-1">App Name</div>
                <div className="font-medium">{site.name}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Domain</div>
                <div className="font-medium">{site.domain}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Tagline</div>
                <div className="font-medium">
                  {site.tagline || <Badge variant="outline">not set</Badge>}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Contact Email</div>
                <div className="font-medium">
                  {site.contactEmail || <Badge variant="outline">not set</Badge>}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Twitter</div>
                <div className="font-medium">
                  {site.twitter || <Badge variant="outline">not set</Badge>}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Instagram</div>
                <div className="font-medium">
                  {site.instagram || <Badge variant="outline">not set</Badge>}
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Required: VITE_APP_NAME, VITE_APP_DOMAIN. Optional: VITE_TAGLINE, VITE_CONTACT_EMAIL, VITE_TWITTER, VITE_INSTAGRAM
            </p>
          </Card>

          {/* Dev Tools Section */}
          {showSampleData && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Dev Tools</h2>
              <div className="space-y-4">
                <div>
                  <Button 
                    variant="outline" 
                    onClick={handleSeedData}
                    disabled={seedMutation.isPending}
                    className="gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    {seedMutation.isPending ? "Loading..." : "Load Sample Data"}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Click to populate with sample football events and tickets
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  Available in development mode or when VITE_ENABLE_SAMPLE_DATA=true
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;