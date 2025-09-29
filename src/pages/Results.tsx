import { useState, useEffect } from "react";
import { ArrowLeft, Filter, SortAsc, MapPin, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams, useNavigate } from "react-router-dom";
import { site } from "@/config/site";
import { searchAll } from "@/providers/searchAll";

const Results = () => {
  const [sortBy, setSortBy] = useState("price");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [warn, setWarn] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);
  
  const searchQuery = searchParams.get('query') || '';
  const location = searchParams.get('location') || '';
  const dateFrom = searchParams.get('dateFrom') || '';
  const dateTo = searchParams.get('dateTo') || '';
  const league = searchParams.get('league') || '';

  useEffect(() => {
    if (searchQuery) {
      performSearch();
    }
  }, [searchQuery, location, dateFrom, dateTo, league]);

  async function performSearch() {
    setLoading(true); 
    setWarn(null); 
    setItems([]);
    try {
      const { results, warnings } = await searchAll({ 
        q: searchQuery,
        city: location,
        startDateTime: dateFrom || undefined,
        endDateTime: dateTo || undefined
      });
      setItems(results);
      if (warnings.length) setWarn(`Ticket source: ${warnings.join("; ")}`);
    } catch (e: any) {
      setWarn(`Search error: ${e.message || e}`);
    }
    setLoading(false);
  }

  const formatPrice = (price: number, currency: string = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const events = items;
  const totalResults = items.length;
  const searchError = warn;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-bold text-primary">{site.name}</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <SortAsc className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Search Results
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                {searchQuery && (
                  <span>Searching for "{searchQuery}"</span>
                )}
                {location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    in {location}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-muted-foreground mb-1">Total Results</p>
              <p className="text-2xl font-bold text-primary">
                {totalResults}
              </p>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {/* Error */}
          {searchError && (
            <div className="rounded bg-amber-100 text-amber-900 text-sm px-3 py-2 border border-amber-200">
              ⚠️ {searchError}
            </div>
          )}
          {loading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-12 h-8" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-10 w-32" />
                </div>
              </Card>
            ))
          ) : events.length === 0 && !loading && !searchError ? (
            <Card className="p-6 text-center">
              <h3 className="font-semibold mb-2">No Events Found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or check back later for new events.
              </p>
              <Button onClick={() => navigate('/')}>
                Back to Search
              </Button>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  {totalResults} events found
                </h2>
                <p className="text-sm text-muted-foreground">
                  Data as of {new Date().toLocaleTimeString()}
                </p>
              </div>

              {events.map((it: any) => (
                <a 
                  key={it.id} 
                  href={it.deepLink} 
                  target="_blank" 
                  rel="noreferrer"
                  className="border rounded p-3 hover:bg-gray-50 block"
                >
                  <div className="text-xs opacity-70">Ticketmaster</div>
                  <div className="font-medium">{it.title}</div>
                  <div className="text-sm">{it.venue}{it.city ? ` — ${it.city}` : ""}</div>
                  <div className="text-sm">{new Date(it.dateTime).toLocaleString()}</div>
                  {it.price?.total == null
                    ? <span className="inline-block mt-1 text-xs bg-gray-200 px-2 py-0.5 rounded">Price on site</span>
                    : <div className="mt-1 font-semibold">${it.price.total}</div>}
                </a>
              ))}
            </>
          )}
        </div>

        {/* Legal Notice */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Prices and availability may change. {site.name} compares prices from multiple providers 
              to help you find the best deals. We redirect to official ticket providers - we don't sell tickets directly.
              When fees are not provided by the provider, we estimate typical fees and clearly mark them.
            </p>
        </div>
      </main>
    </div>
  );
};

export default Results;