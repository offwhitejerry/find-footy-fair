import { useState, useEffect } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetClicks } from "@/hooks/useEvents";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { setPageTitle } from "@/lib/head";
import AdminMeta from "@/components/AdminMeta";

const AdminClicks = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 50;
  
  const { data, isLoading, error } = useGetClicks(pageSize, currentPage * pageSize);
  
  useEffect(() => {
    setPageTitle("Admin - Clicks");
  }, []);
  
  const formatPrice = (price: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price);
  };

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
            <h1 className="text-xl font-bold text-primary">Clicks Analytics</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Recent Clicks</h1>
            <p className="text-muted-foreground">
              Track affiliate clicks and conversions
            </p>
          </div>

          {/* Stats */}
          {data && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="text-sm font-medium text-muted-foreground">Total Clicks</div>
                <div className="text-2xl font-bold">{data.total?.toLocaleString() || 0}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm font-medium text-muted-foreground">Today</div>
                <div className="text-2xl font-bold">
                  {data.clicks?.filter(click => 
                    new Date(click.clicked_at).toDateString() === new Date().toDateString()
                  ).length || 0}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm font-medium text-muted-foreground">This Hour</div>
                <div className="text-2xl font-bold">
                  {data.clicks?.filter(click => 
                    new Date(click.clicked_at).getTime() > Date.now() - 3600000
                  ).length || 0}
                </div>
              </Card>
            </div>
          )}

          {/* Clicks Table */}
          <Card className="p-6">
            <div className="space-y-4">
              {isLoading && (
                <div className="space-y-3">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <div className="text-center py-8">
                  <p className="text-destructive">Error loading clicks: {error.message}</p>
                </div>
              )}

              {data?.clicks && data.clicks.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No clicks recorded yet</p>
                </div>
              )}

              {data?.clicks && data.clicks.length > 0 && (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 font-medium">Time</th>
                          <th className="text-left py-2 font-medium">Provider</th>
                          <th className="text-left py-2 font-medium">Price</th>
                          <th className="text-left py-2 font-medium">Click ID</th>
                          <th className="text-left py-2 font-medium">Event</th>
                          <th className="text-left py-2 font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.clicks.map((click) => (
                          <tr key={click.id} className="border-b hover:bg-muted/50">
                            <td className="py-3">
                              <div className="space-y-1">
                                <div className="text-sm">
                                  {formatDistanceToNow(new Date(click.clicked_at), { addSuffix: true })}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(click.clicked_at).toLocaleString()}
                                </div>
                              </div>
                            </td>
                            <td className="py-3">
                              <Badge variant="outline">{click.provider_name}</Badge>
                            </td>
                            <td className="py-3">
                              {click.price_shown ? (
                                <span className="font-medium">
                                  {formatPrice(click.price_shown, click.currency)}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </td>
                            <td className="py-3">
                              <code className="text-xs bg-muted px-2 py-1 rounded">
                                {click.click_id.slice(0, 8)}...
                              </code>
                            </td>
                            <td className="py-3">
                              {click.event_id ? (
                                <span className="text-xs text-muted-foreground">{click.event_id}</span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </td>
                            <td className="py-3">
                              {click.provider_url && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(click.provider_url, '_blank')}
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between pt-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, data.total || 0)} of {data.total || 0} clicks
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                        disabled={currentPage === 0}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        disabled={!data.total || (currentPage + 1) * pageSize >= data.total}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminClicks;