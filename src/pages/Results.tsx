import { useState } from "react";
import { ArrowLeft, Filter, SortAsc, MapPin, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data - will be replaced with API calls
const mockResults = [
  {
    id: "1",
    provider: "SeatGeek",
    providerLogo: "/api/placeholder/80/40",
    section: "Section 101",
    row: "Row 12",
    quantity: 2,
    basePrice: 85,
    fees: 15,
    totalPrice: 100,
    currency: "USD",
    deliveryType: "instant",
    feesKnown: true,
    url: "https://seatgeek.com/...",
  },
  {
    id: "2", 
    provider: "Ticketmaster",
    providerLogo: "/api/placeholder/80/40",
    section: "Section 205",
    row: "Row 8",
    quantity: 2,
    basePrice: 92,
    fees: 18,
    totalPrice: 110,
    currency: "USD",
    deliveryType: "e-ticket",
    feesKnown: false,
    url: "https://ticketmaster.com/...",
  },
  {
    id: "3",
    provider: "TickPick", 
    providerLogo: "/api/placeholder/80/40",
    section: "Section 132",
    row: "Row 15",
    quantity: 2,
    basePrice: 88,
    fees: 12,
    totalPrice: 100,
    currency: "USD",
    deliveryType: "mobile",
    feesKnown: true,
    url: "https://tickpick.com/...",
  }
];

const mockEvent = {
  id: "event-1",
  homeTeam: "Manchester United",
  awayTeam: "Liverpool FC", 
  venue: "Old Trafford",
  city: "Manchester",
  kickoffTime: "2024-01-15T15:00:00Z",
  league: "Premier League"
};

const Results = () => {
  const [sortBy, setSortBy] = useState("price");

  const formatPrice = (price: number, currency: string) => {
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

  const datetime = formatDateTime(mockEvent.kickoffTime);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-bold text-primary">FootyFare</h1>
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
        {/* Event Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {mockEvent.homeTeam} vs {mockEvent.awayTeam}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {mockEvent.venue}, {mockEvent.city}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {datetime.date} at {datetime.time}
                </div>
                <Badge variant="secondary">{mockEvent.league}</Badge>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-muted-foreground mb-1">From</p>
              <p className="text-2xl font-bold text-primary">
                {formatPrice(Math.min(...mockResults.map(r => r.totalPrice)), "USD")}
              </p>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {mockResults.length} tickets available
            </h2>
            <p className="text-sm text-muted-foreground">
              Data as of {new Date().toLocaleTimeString()}
            </p>
          </div>

          {mockResults.map((ticket) => (
            <Card key={ticket.id} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                {/* Provider */}
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                    <span className="text-xs font-medium">{ticket.provider}</span>
                  </div>
                  <div>
                    <p className="font-medium">{ticket.provider}</p>
                    <div className="flex items-center space-x-2">
                      {ticket.deliveryType === "instant" && (
                        <Badge variant="secondary" className="text-xs">
                          Instant delivery
                        </Badge>
                      )}
                      {!ticket.feesKnown && (
                        <div className="flex items-center text-warning">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          <span className="text-xs">Fees estimated</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Seat Info */}
                <div className="text-sm">
                  <p className="font-medium">{ticket.section}</p>
                  {ticket.row && <p className="text-muted-foreground">{ticket.row}</p>}
                  <p className="text-muted-foreground">Qty: {ticket.quantity}</p>
                </div>

                {/* Price Breakdown */}
                <div className="text-sm">
                  <p className="text-muted-foreground">
                    Base: {formatPrice(ticket.basePrice, ticket.currency)}
                  </p>
                  <p className="text-muted-foreground">
                    Fees: {formatPrice(ticket.fees, ticket.currency)}
                    {!ticket.feesKnown && " (est.)"}
                  </p>
                  <p className="font-bold text-lg">
                    {formatPrice(ticket.totalPrice, ticket.currency)}
                  </p>
                </div>

                {/* Action */}
                <div className="md:text-right">
                  <Button className="w-full md:w-auto">
                    Buy on {ticket.provider}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Legal Notice */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Prices and availability may change. Fees shown if provided by seller, otherwise estimated. 
            FootyFare redirects to official ticket providers - we don't sell tickets directly.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Results;