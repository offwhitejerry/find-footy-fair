import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { site } from "@/config/site";
import { setPageTitle } from "@/lib/head";

const Legal = () => {
  useEffect(() => {
    setPageTitle("Legal Information");
  }, []);

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
            <h1 className="text-xl font-bold text-primary">{site.name}</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-4">Legal Information</h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">About {site.name}</h2>
            <div className="space-y-4 text-sm">
              <p>
                {site.name} is a ticket comparison service that helps users find and compare 
                football ticket prices from multiple authorized providers. We are not a 
                ticket marketplace and do not sell tickets directly.
              </p>
              <p>
                When you click "Buy on [Provider]", you are redirected to the official 
                ticket provider's website where the actual purchase takes place. {site.name} 
                does not process payments or handle ticket fulfillment.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Price and Availability Disclaimer</h2>
            <div className="space-y-4 text-sm">
              <p>
                <strong>Prices and availability are subject to change.</strong> The prices 
                shown on {site.name} are provided by third-party ticket providers and may 
                not reflect real-time availability or pricing.
              </p>
              <p>
                <strong>Fees:</strong> When providers supply complete pricing including 
                all fees, we display those prices. When only base ticket prices are 
                available, we estimate additional fees based on typical provider fee 
                structures. Estimated fees are clearly marked and actual fees may vary.
              </p>
              <p>
                We recommend verifying final prices and availability directly with the 
                ticket provider before completing your purchase.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Third-Party Providers</h2>
            <div className="space-y-4 text-sm">
              <p>
                {site.name} partners with authorized ticket resellers and primary ticket 
                providers including:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>SeatGeek</li>
                <li>Ticketmaster</li>
                <li>TickPick</li>
                <li>Gametime</li>
                <li>Other authorized providers</li>
              </ul>
              <p>
                Each provider has their own terms of service, refund policies, and 
                customer support. By purchasing through a provider, you agree to their 
                terms and conditions.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Data and Privacy</h2>
            <div className="space-y-4 text-sm">
              <p>
                {site.name} collects minimal user data to improve our service. We track:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Search queries (to improve results)</li>
                <li>Click-through data (for analytics and affiliate tracking)</li>
                <li>Basic usage analytics</li>
              </ul>
              <p>
                We do not store personal information, payment details, or sell user data 
                to third parties. When you click through to a provider, their privacy 
                policy applies.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Affiliate Relationships</h2>
            <div className="space-y-4 text-sm">
              <p>
                {site.name} may earn a commission when you purchase tickets through our 
                partner providers. This does not affect the price you pay - commissions 
                are paid by the provider.
              </p>
              <p>
                Our affiliate relationships do not influence our search results or 
                rankings, which are primarily based on ticket price and availability.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Limitation of Liability</h2>
            <div className="space-y-4 text-sm">
              <p>
                {site.name} provides information and comparison services only. We are not 
                responsible for:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Ticket authenticity or validity</li>
                <li>Event cancellations or postponements</li>
                <li>Provider customer service or refund policies</li>
                <li>Accuracy of real-time pricing or availability</li>
                <li>Any issues with your ticket purchase or event experience</li>
              </ul>
              <p>
                All transactions are between you and the ticket provider. For support 
                with your purchase, contact the provider directly.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4 text-sm">
              <p>
                For questions about {site.name} or this legal notice:
              </p>
              <div className="space-y-2">
                <p><strong>Email:</strong> {site.contactEmail}</p>
                <p><strong>Support:</strong> {site.contactEmail}</p>
              </div>
              <p>
                For issues with ticket purchases, please contact the provider directly 
                through their customer support channels.
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Legal;