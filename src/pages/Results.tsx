import { useState } from "react";
import { ArrowLeft, Filter, SortAsc, MapPin, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSearchEvents } from "@/hooks/useEvents";
import { site } from "@/config/site";

const Results = () => {
  const [sortBy, setSortBy] = useState("price");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const searchQuery = searchParams.get('query') || '';
  const location = searchParams.get('location') || '';
  const dateFrom = searchParams.get('dateFrom') || '';
  const dateTo = searchParams.get('dateTo') || '';
  const league = searchParams.get('league') || '';
  
  const { data, isLoading, error } = useSearchEvents({
    query: searchQuery,
    location: location,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    league: league || undefined,
  });

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

  const events = data?.events || [];
  const totalResults = data?.total || 0;

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
          {isLoading ? (
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
          ) : error ? (
            <Card className="p-6 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">Error Loading Results</h3>
              <p className="text-muted-foreground mb-4">
                We couldn't load the search results. Please try again.
              </p>
              <Button onClick={() => window.location.reload()}>
                Retry
              </Button>
            </Card>
          ) : events.length === 0 ? (
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

              {events.map((event: any) => {
                const datetime = formatDateTime(event.event_date);
                return (
                  <Card 
                    key={event.id} 
                    className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => navigate(`/event/${event.id}`)}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      {/* Event Info */}
                      <div className="md:col-span-2">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge variant="secondary">{event.competition || 'Football'}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {event.ticket_count || 0} tickets available
                          </span>
                        </div>
                        <h3 className="font-bold text-lg mb-1">
                          {event.home_team} vs {event.away_team}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {event.venue}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {datetime.date} at {datetime.time}
                          </div>
                        </div>
                      </div>

                      {/* League */}
                      <div className="text-sm">
                        <p className="font-medium">{event.league || 'League TBA'}</p>
                        <p className="text-muted-foreground">
                          {event.status === 'upcoming' ? 'Upcoming' : event.status}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="md:text-right">
                        <p className="text-sm text-muted-foreground mb-1">From</p>
                        <p className="font-bold text-xl text-primary">
                          {event.min_price ? formatPrice(event.min_price) : 'TBA'}
                        </p>
                        <Button className="mt-2 w-full md:w-auto">
                          View Tickets
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </>
          )}
        </div>

        {/* Legal Notice */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Prices and availability may change. FootyFare compares prices from multiple providers 
              to help you find the best deals. We redirect to official ticket providers - we don't sell tickets directly.
              When fees are not provided by the provider, we estimate typical fees and clearly mark them.
            </p>
        </div>
      </main>
    </div>
  );
};

export default Results;