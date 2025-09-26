import { useState } from "react";
import { Search, Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Navigate to results page
      console.log("Searching for:", searchQuery);
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
            <h1 className="text-2xl font-bold text-primary">FootyFare</h1>
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
            Compare prices from multiple providers and find the best deals on football tickets. 
            We search, you save.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-12">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for teams, matches, leagues, or cities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-24 py-6 text-lg rounded-full border-2 focus:border-primary"
              />
              <Button 
                type="submit" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-6"
                disabled={!searchQuery.trim()}
              >
                Search
              </Button>
            </div>
          </form>

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
      </main>
    </div>
  );
};

export default Index;
