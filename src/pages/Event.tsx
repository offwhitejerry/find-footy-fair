import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Clock, Calendar, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLogClick } from "@/hooks/useEvents";
import { generateUUID, appendSubIdToUrl } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { site } from "@/config/site";
import { setPageTitle } from "@/lib/head";

// Mock data - will be replaced with API calls
const mockEvent = {
  id: "event-1",
  homeTeam: "Manchester United",
  awayTeam: "Liverpool FC",
  venue: "Old Trafford", 
  city: "Manchester",
  country: "England",
  kickoffTime: "2024-01-15T15:00:00Z",
  league: "Premier League",
  competition: "Premier League 2023/24",
  homeTeamLogo: "/api/placeholder/80/80",
  awayTeamLogo: "/api/placeholder/80/80",
  venueCapacity: 74879,
  weather: "Partly cloudy, 12°C"
};

const mockCheapestOptions = [
  {
    id: "1",
    provider: "SeatGeek",
    section: "Section 101", 
    price: 95,
    currency: "USD",
    deliveryType: "instant",
    providerUrl: "https://seatgeek.com/manchester-united-vs-liverpool-fc",
    feesEstimated: true
  },
  {
    id: "2",
    provider: "TickPick",
    section: "Section 205",
    price: 87,
    currency: "USD", 
    deliveryType: "e-ticket",
    providerUrl: "https://tickpick.com/buy-manchester-united-vs-liverpool-fc-tickets",
    feesEstimated: false
  },
  {
    id: "3",
    provider: "Ticketmaster",
    section: "Section 132",
    price: 110,
    currency: "USD",
    deliveryType: "mobile",
    providerUrl: "https://ticketmaster.com/manchester-united-vs-liverpool-fc-tickets",
    feesEstimated: true
  }
];

const Event = () => {
  const logClick = useLogClick();

  useEffect(() => {
    setPageTitle(`${mockEvent.homeTeam} vs ${mockEvent.awayTeam}`);
  }, []);
  
  const handleBuyClick = async (option: any) => {
    const clickId = generateUUID();
    
    try {
      // Log the click
      await logClick.mutateAsync({
        click_id: clickId,
        event_id: mockEvent.id,
        provider_name: option.provider,
        price_shown: option.price,
        currency: option.currency,
        provider_url: option.providerUrl
      });

      // Redirect to provider with subid
      const urlWithSubId = appendSubIdToUrl(option.providerUrl, clickId);
      window.open(urlWithSubId, '_blank');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to track click. Opening provider link...",
        variant: "destructive"
      });
      // Fallback: open original URL
      window.open(option.providerUrl, '_blank');
    }
  };
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      fullDate: date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }),
      monthDay: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  };

  const datetime = formatDateTime(mockEvent.kickoffTime);
  const cheapestPrice = Math.min(...mockCheapestOptions.map(option => option.price));

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
              <h1 className="text-xl font-bold text-primary">{site.name}</h1>
            </div>
            <Button>
              View All Tickets
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Event Hero */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Event Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-8">
                  {/* Home Team */}
                  <div className="text-center">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-2">
                      <span className="text-2xl font-bold">MU</span>
                    </div>
                    <h3 className="font-semibold text-lg">{mockEvent.homeTeam}</h3>
                    <p className="text-sm text-muted-foreground">Home</p>
                  </div>

                  {/* VS */}
                  <div className="text-center">
                    <div className="text-3xl font-bold text-muted-foreground mb-2">VS</div>
                    <div className="text-sm text-muted-foreground">
                      {datetime.monthDay}
                    </div>
                  </div>

                  {/* Away Team */}
                  <div className="text-center">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-2">
                      <span className="text-2xl font-bold">LFC</span>
                    </div>
                    <h3 className="font-semibold text-lg">{mockEvent.awayTeam}</h3>
                    <p className="text-sm text-muted-foreground">Away</p>
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {mockEvent.homeTeam} vs {mockEvent.awayTeam}
                  </h1>
                  <Badge variant="secondary" className="mb-4">
                    {mockEvent.competition}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{datetime.fullDate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Kickoff: {datetime.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{mockEvent.venue}, {mockEvent.city}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <span>Capacity: {mockEvent.venueCapacity.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6">
                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground mb-1">Tickets from</p>
                  <p className="text-4xl font-bold text-primary mb-2">
                    {formatPrice(cheapestPrice, "USD")}
                  </p>
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <p className="text-sm text-muted-foreground">
                      {mockCheapestOptions.length} providers available
                    </p>
                    <Badge variant="outline" className="text-xs">
                      Fees estimated
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Data as of {new Date().toLocaleTimeString()}
                  </p>
                </div>
                <Button className="w-full mb-4" size="lg">
                  See All Tickets
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  Set Price Alert
                </Button>
              </Card>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="tickets" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tickets">Cheapest Options</TabsTrigger>
            <TabsTrigger value="info">Event Info</TabsTrigger>
          </TabsList>

          <TabsContent value="tickets" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Cheapest tickets by provider</h3>
              <p className="text-xs text-muted-foreground">
                Data as of {new Date().toLocaleTimeString()}
              </p>
            </div>
            <div className="grid gap-4">
              {mockCheapestOptions.map((option) => (
                <Card key={option.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                        <span className="text-xs font-medium">{option.provider}</span>
                      </div>
                      <div>
                        <p className="font-medium">{option.provider}</p>
                        <p className="text-sm text-muted-foreground">{option.section}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {option.deliveryType === "instant" && (
                            <Badge variant="secondary" className="text-xs">
                              Instant delivery
                            </Badge>
                          )}
                          {option.feesEstimated && (
                            <Badge variant="outline" className="text-xs">
                              Fees estimated
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">
                        {formatPrice(option.price, option.currency)}
                      </p>
                      <Button 
                        size="sm" 
                        className="mt-2"
                        onClick={() => handleBuyClick(option)}
                        disabled={logClick.isPending}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Buy on {option.provider}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="info" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Venue Information</h3>
              <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium mb-1">Venue</p>
                    <p className="text-muted-foreground">{mockEvent.venue}</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Location</p>
                    <p className="text-muted-foreground">{mockEvent.city}, {mockEvent.country}</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Capacity</p>
                    <p className="text-muted-foreground">{mockEvent.venueCapacity.toLocaleString()} seats</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Weather</p>
                    <p className="text-muted-foreground">{mockEvent.weather}</p>
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Match Details</h3>
              <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium mb-1">Competition</p>
                    <p className="text-muted-foreground">{mockEvent.competition}</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Season</p>
                    <p className="text-muted-foreground">2023/24</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Round</p>
                    <p className="text-muted-foreground">Matchday 21</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Referee</p>
                    <p className="text-muted-foreground">TBD</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Event;