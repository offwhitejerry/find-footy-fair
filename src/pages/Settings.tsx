import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Settings = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-bold text-primary">Settings</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-4">Application Settings</h1>
            <p className="text-muted-foreground">
              Configure environment variables and system settings
            </p>
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Affiliate Tracking</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subid-param">Affiliate SubID Parameter</Label>
                <Input
                  id="subid-param"
                  placeholder="subid"
                  defaultValue="subid"
                  disabled
                />
                <p className="text-sm text-muted-foreground">
                  The URL parameter name used for affiliate tracking. Default: "subid"
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">API Configuration</h2>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Environment variables are managed through the Supabase integration. 
                These settings show current configuration values.
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="db-url">Database URL</Label>
                  <Input
                    id="db-url"
                    placeholder="Connected via Supabase"
                    disabled
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="functions-url">Edge Functions URL</Label>
                  <Input
                    id="functions-url"
                    placeholder="/api/functions/v1"
                    disabled
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Display Settings</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency</Label>
                <Input
                  id="currency"
                  placeholder="USD"
                  defaultValue="USD"
                  disabled
                />
                <p className="text-sm text-muted-foreground">
                  Default currency for price display
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="results-limit">Results Per Page</Label>
                <Input
                  id="results-limit"
                  placeholder="50"
                  defaultValue="50"
                  disabled
                />
                <p className="text-sm text-muted-foreground">
                  Maximum number of results to display per page
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-muted/50">
            <h2 className="text-xl font-semibold mb-4">Development Note</h2>
            <div className="space-y-4 text-sm">
              <p>
                This settings page shows placeholder configuration values. In a production environment, 
                these would be configurable environment variables managed through your deployment platform.
              </p>
              <p>
                With Lovable's Supabase integration, environment variables and secrets are managed 
                through the Supabase dashboard and edge functions.
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;