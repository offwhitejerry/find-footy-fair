import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, Lock, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { signOutAdmin } from "@/utils/adminAuth";
import AdminMeta from "@/components/AdminMeta";
import { toast } from "sonner";
import { ticketmasterHealth } from "@/providers/ticketmasterHealth";
import { loadPrefs, savePrefs, type ProviderPrefs } from "@/lib/providerPrefs";

const Providers = () => {
  const [prefs, setPrefs] = useState<ProviderPrefs>(loadPrefs());
  const [seatgeekEnabled, setSeatgeekEnabled] = useState(true);
  const [tmHealth, setTmHealth] = useState<{hasKey:boolean; ok:boolean} | null>(null);
  const [providerStatus, setProviderStatus] = useState({
    seatgeek: 'checking',
    ticketmaster: 'checking',
    database: 'active',
    mock: 'active'
  });

  useEffect(() => {
    setPrefs(loadPrefs()); // hydrate from localStorage on mount
    
    // Check SeatGeek status
    const checkSeatGeekStatus = async () => {
      try {
        const response = await fetch('/api/functions/v1/seatgeek-adapter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: 'test', limit: 1 }),
        });
        
        const data = await response.json();
        
        if (data.error && data.error.includes('not configured')) {
          setProviderStatus(prev => ({ ...prev, seatgeek: 'missing_key' }));
        } else if (data.provider_status === 'active') {
          setProviderStatus(prev => ({ ...prev, seatgeek: 'active' }));
        } else {
          setProviderStatus(prev => ({ ...prev, seatgeek: 'error' }));
        }
      } catch (error) {
        setProviderStatus(prev => ({ ...prev, seatgeek: 'error' }));
      }
    };

    // Check Ticketmaster status
    const checkTicketmasterStatus = async () => {
      try {
        const health = await ticketmasterHealth();
        setTmHealth(health);
        
        if (health.hasKey && health.ok) {
          setProviderStatus(prev => ({ ...prev, ticketmaster: 'active' }));
        } else if (!health.hasKey) {
          setProviderStatus(prev => ({ ...prev, ticketmaster: 'missing_key' }));
        } else {
          setProviderStatus(prev => ({ ...prev, ticketmaster: 'error' }));
        }
      } catch (error) {
        console.warn('Ticketmaster health check error:', error);
        setTmHealth({ hasKey: false, ok: false });
        setProviderStatus(prev => ({ ...prev, ticketmaster: 'error' }));
      }
    };

    checkSeatGeekStatus();
    checkTicketmasterStatus();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'missing_key':
      case 'disabled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Key detected';
      case 'missing_key':
        return 'Key missing';
      case 'disabled':
        return 'Disabled';
      case 'error':
        return 'Error';
      case 'checking':
        return 'Checking...';
      default:
        return 'Unknown';
    }
  };

  const onToggleTicketmaster = (next: boolean) => {
    const updated = { ...prefs, ticketmaster: next };
    setPrefs(updated);
    savePrefs(updated);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'missing_key':
      case 'disabled':
        return 'destructive';
      case 'error':
        return 'secondary';
      default:
        return 'outline';
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
                Provider Management
                <Lock className="h-4 w-4" />
              </h1>
            </div>
            <Button variant="ghost" size="sm" onClick={signOutAdmin} className="text-destructive hover:text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Ticket Providers</h1>
            <p className="text-muted-foreground">
              Manage and monitor ticket provider integrations
            </p>
          </div>

          {/* Provider Cards */}
          <div className="grid gap-4">
            {/* SeatGeek */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(providerStatus.seatgeek)}
                    <div>
                      <h3 className="font-semibold">SeatGeek</h3>
                      <p className="text-sm text-muted-foreground">
                        Premium ticket marketplace with live inventory
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant={getStatusColor(providerStatus.seatgeek)}>
                    {getStatusText(providerStatus.seatgeek)}
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="seatgeek-toggle"
                      checked={seatgeekEnabled && providerStatus.seatgeek === 'active'}
                      onCheckedChange={setSeatgeekEnabled}
                      disabled={providerStatus.seatgeek === 'missing_key'}
                    />
                    <Label htmlFor="seatgeek-toggle">Enable</Label>
                  </div>
                </div>
              </div>
              
              {providerStatus.seatgeek === 'missing_key' && (
                <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">
                    <strong>Configuration Required:</strong> Add SEATGEEK_API_KEY to your environment variables to enable this provider.
                  </p>
                </div>
              )}
              
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <div className="text-xs text-muted-foreground">Reliability</div>
                  <div className="text-sm font-medium">95%</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Avg Response</div>
                  <div className="text-sm font-medium">200ms</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Delivery Methods</div>
                  <div className="text-sm font-medium">Mobile, Instant</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Fee Structure</div>
                  <div className="text-sm font-medium">All-in Pricing</div>
                </div>
              </div>
            </Card>

            {/* Ticketmaster */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(providerStatus.ticketmaster)}
                    <div>
                      <h3 className="font-semibold">Ticketmaster</h3>
                      <p className="text-sm text-muted-foreground">
                        Official tickets directly from Ticketmaster
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {tmHealth?.hasKey ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-xs">Key detected</span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-xs">Key missing</span>
                  )}
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="ticketmaster-toggle"
                      checked={!!prefs.ticketmaster}
                      onCheckedChange={onToggleTicketmaster}
                    />
                    <Label htmlFor="ticketmaster-toggle">Enable</Label>
                  </div>
                </div>
              </div>
              
              {!tmHealth?.hasKey && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Add <code>TICKETMASTER_API_KEY</code> in Supabase secrets and redeploy the functions.
                </p>
              )}
              
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <div className="text-xs text-muted-foreground">Reliability</div>
                  <div className="text-sm font-medium">90%</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Avg Response</div>
                  <div className="text-sm font-medium">300ms</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Delivery Methods</div>
                  <div className="text-sm font-medium">Mobile, Paper</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Fee Structure</div>
                  <div className="text-sm font-medium">Transparent</div>
                </div>
              </div>
            </Card>

            {/* Database Provider */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(providerStatus.database)}
                    <div>
                      <h3 className="font-semibold">Database Events</h3>
                      <p className="text-sm text-muted-foreground">
                        Local database with curated event listings
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant={getStatusColor(providerStatus.database)}>
                    {getStatusText(providerStatus.database)}
                  </Badge>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <div className="text-xs text-muted-foreground">Reliability</div>
                  <div className="text-sm font-medium">99%</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Avg Response</div>
                  <div className="text-sm font-medium">50ms</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Update Frequency</div>
                  <div className="text-sm font-medium">Real-time</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Coverage</div>
                  <div className="text-sm font-medium">Global</div>
                </div>
              </div>
            </Card>

            {/* Mock Provider */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(providerStatus.mock)}
                    <div>
                      <h3 className="font-semibold">Mock Provider</h3>
                      <p className="text-sm text-muted-foreground">
                        Fallback provider ensuring results are always available
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant={getStatusColor(providerStatus.mock)}>
                    {getStatusText(providerStatus.mock)}
                  </Badge>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <div className="text-xs text-muted-foreground">Reliability</div>
                  <div className="text-sm font-medium">100%</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Avg Response</div>
                  <div className="text-sm font-medium">0ms</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Purpose</div>
                  <div className="text-sm font-medium">Fallback</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Fee Structure</div>
                  <div className="text-sm font-medium">Estimated</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Settings Section */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Provider Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-enable new providers</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically enable new ticket providers when they become available
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Fallback to mock data</Label>
                  <p className="text-sm text-muted-foreground">
                    Show sample results when no providers return data
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Providers;