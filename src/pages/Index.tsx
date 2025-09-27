import { useState, useEffect } from "react";
import { Search, Calendar, MapPin, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useSeedSampleData } from "@/hooks/useEvents";
import { useToast } from "@/hooks/use-toast";
import { site } from "@/config/site";
import { setPageTitle } from "@/lib/head";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const seedMutation = useSeedSampleData();

  useEffect(() => {
    setPageTitle();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set('query', searchQuery);
      if (location.trim()) {
        params.set('location', location);
      }
      navigate(`/results?${params.toString()}`);
    }
  };

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

  const popularSearches = [
    "Real Madrid vs Barcelona",
    "Premier League",
    "Champions League Final",
    "Manchester United",
    "Liverpool FC"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">{site.name}</h1>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="/legal" className="text-muted-foreground hover:text-foreground">Legal</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            Find the <span className="text-primary">Cheapest</span> Football Tickets
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {site.tagline}
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-12">
            <div className="flex gap-4 max-w-4xl mx-auto">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search for teams, matches, leagues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-4 text-lg rounded-lg border-2 focus:border-primary"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder="City or venue..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-12 py-4 text-lg rounded-lg border-2 focus:border-primary"
                />
              </div>
              <Button 
                type="submit" 
                className="px-8 py-4 text-lg rounded-lg"
                disabled={!searchQuery.trim()}
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </form>

          {/* Sample Data Button */}
          <div className="text-center mb-8">
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
              Click to populate with sample football events
            </p>
          </div>

          {/* Popular Searches */}
          <div className="mb-16">
            <p className="text-muted-foreground mb-4">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(search)}
                  className="px-4 py-2 bg-accent text-accent-foreground rounded-full text-sm hover:bg-accent/80 transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Compare Prices</h3>
              <p className="text-muted-foreground text-sm">
                Search across multiple ticket providers to find the best deals
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">All Providers</h3>
              <p className="text-muted-foreground text-sm">
                Access tickets from SeatGeek, Ticketmaster, TickPick, and more
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Instant Results</h3>
              <p className="text-muted-foreground text-sm">
                Real-time pricing and availability from trusted sources
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">{site.name}</h3>
              <p className="text-sm text-muted-foreground">
                {site.tagline} We're a search service, not a marketplace.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Legal</h4>
              <div className="space-y-2 text-sm">
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-muted-foreground hover:text-foreground"
                  onClick={() => navigate('/legal')}
                >
                  Legal Information
                </Button>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-muted-foreground hover:text-foreground"
                  onClick={() => navigate('/privacy')}
                >
                  Privacy Policy
                </Button>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-muted-foreground hover:text-foreground"
                  onClick={() => navigate('/terms')}
                >
                  Terms of Service
                </Button>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-4">Admin</h4>
              <div className="space-y-2 text-sm">
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-muted-foreground hover:text-foreground"
                  onClick={() => navigate('/admin')}
                >
                  View Clicks
                </Button>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-muted-foreground hover:text-foreground"
                  onClick={() => navigate('/settings')}
                >
                  Settings
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 {site.name}. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
