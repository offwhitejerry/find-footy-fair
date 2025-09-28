import { useState, useEffect } from "react";
import { Search, Calendar, MapPin, Users, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { site } from "@/config/site";
import { setPageTitle } from "@/lib/head";
import popularUsData from "@/data/popular-us.json";
import { isAdminVisible, signOutAdmin } from "@/utils/adminAuth";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const enableInternational = import.meta.env.VITE_ENABLE_INTERNATIONAL === 'true';

  useEffect(() => {
    setPageTitle();
  }, []);

  const handleSearch = (searchTerm?: string, searchLeague?: string) => {
    const query = searchTerm || searchQuery;
    if (query.trim()) {
      const params = new URLSearchParams();
      params.set('query', query);
      if (location.trim()) {
        params.set('location', location);
      }
      if (searchLeague) {
        params.set('league', searchLeague);
      }
      navigate(`/results?${params.toString()}`);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };


  const popularSearches = enableInternational ? [
    ...popularUsData,
    // International teams would be added here when enabled
  ] : popularUsData;

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
          {site.tagline && (
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {site.tagline}
            </p>
          )}

          {/* Search Form */}
          <form onSubmit={handleFormSubmit} className="mb-12">
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


          {/* Popular Searches */}
          <div className="mb-16">
            <p className="text-muted-foreground mb-4">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularSearches.map((search) => (
                <button
                  key={search.slug}
                  onClick={() => handleSearch(search.label, search.league)}
                  className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-full text-sm hover:bg-accent/80 transition-colors"
                >
                  <span>{search.label}</span>
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                    {search.league}
                  </span>
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
        <footer className="border-t">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Brand / About */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground">About</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {site.name} is a soccer ticket meta-search. We compare prices and redirect you to the seller.
                </p>
              </div>

              {/* Legal (vertical list) */}
              <nav aria-labelledby="footer-legal">
                <h3 id="footer-legal" className="text-sm font-semibold text-muted-foreground">Legal</h3>
                <ul className="mt-2 space-y-2 text-sm">
                  <li><a className="text-muted-foreground hover:text-foreground hover:underline" href="/legal">Legal</a></li>
                  <li><a className="text-muted-foreground hover:text-foreground hover:underline" href="/privacy">Privacy</a></li>
                  <li><a className="text-muted-foreground hover:text-foreground hover:underline" href="/terms">Terms</a></li>
                </ul>
              </nav>

              {/* Contact (only if email exists) */}
              {site.contactEmail && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground">Contact</h3>
                  <div className="mt-2 text-sm">
                    <a className="text-muted-foreground hover:text-foreground hover:underline" href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 border-t pt-6 text-xs text-muted-foreground">
              © {new Date().getFullYear()} {site.name}. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;