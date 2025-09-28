import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { site } from "@/config/site";
import { setPageTitle } from "@/lib/head";

const Terms = () => {
  useEffect(() => {
    setPageTitle("Terms of Service");
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
            <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Service Description</h2>
            <div className="space-y-4 text-sm">
              <p>
                {site.name} is a <strong>search and redirect service</strong>, not a ticket marketplace. 
                We help you find and compare football ticket prices from authorized providers but 
                do not sell tickets directly.
              </p>
              <p>
                When you click "Buy on [Provider]", you are redirected to the provider's official 
                website where the actual purchase takes place. {site.name} does not process payments 
                or handle ticket fulfillment.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Acceptance of Terms</h2>
            <div className="space-y-4 text-sm">
              <p>
                By using {site.name}, you agree to these Terms of Service. If you do not agree 
                with any part of these terms, you may not use our service.
              </p>
              <p>
                We reserve the right to modify these terms at any time. Continued use of our 
                service after changes constitutes acceptance of the new terms.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Pricing and Availability Disclaimer</h2>
            <div className="space-y-4 text-sm">
              <p>
                <strong>IMPORTANT:</strong> Prices and availability shown on {site.name} are subject 
                to change without notice. We are not responsible for price discrepancies or 
                ticket availability.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Real-time pricing:</strong> When providers supply complete pricing including all fees, we display those exact prices</li>
                <li><strong>Estimated pricing:</strong> When only base ticket prices are available, we estimate additional fees based on typical provider fee structures</li>
                <li><strong>Fee estimates:</strong> Estimated fees are clearly marked with "Fees estimated" badges</li>
                <li><strong>Verification required:</strong> Always verify final prices and availability directly with the provider before purchase</li>
              </ul>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Third-Party Providers</h2>
            <div className="space-y-4 text-sm">
              <p>
                {site.name} partners with authorized ticket providers. Each provider operates 
                independently with their own:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Terms of service and conditions</li>
                <li>Pricing and fee structures</li>
                <li>Refund and cancellation policies</li>
                <li>Customer service and support</li>
                <li>Delivery methods and timeframes</li>
              </ul>
              <p>
                <strong>By purchasing through a provider, you agree to their terms and conditions.</strong> 
                {site.name} is not responsible for provider policies or service quality.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">User Responsibilities</h2>
            <div className="space-y-4 text-sm">
              <p>
                As a {site.name} user, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Use our service lawfully and responsibly</li>
                <li>Provide accurate search information</li>
                <li>Verify all details with providers before purchase</li>
                <li>Respect intellectual property rights</li>
                <li>Not attempt to manipulate or harm our service</li>
                <li>Not use automated tools to scrape our data</li>
              </ul>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Limitation of Liability</h2>
            <div className="space-y-4 text-sm">
              <p>
                <strong>{site.name} provides information services only.</strong> We are not liable for:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Ticket authenticity, validity, or delivery issues</li>
                <li>Event cancellations, postponements, or changes</li>
                <li>Provider customer service or refund policies</li>
                <li>Accuracy of pricing or availability information</li>
                <li>Any losses from ticket purchases or event experiences</li>
                <li>Technical issues or service interruptions</li>
              </ul>
              <p>
                <strong>All transactions are between you and the ticket provider.</strong> For 
                purchase support, contact the provider directly.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Affiliate Relationships</h2>
            <div className="space-y-4 text-sm">
              <p>
                {site.name} may earn commissions when you purchase tickets through our partner 
                providers. This affiliate relationship:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Does not affect the price you pay - commissions are paid by providers</li>
                <li>Does not influence our search results or rankings</li>
                <li>Is tracked through click IDs for commission attribution</li>
                <li>Helps us maintain our free service</li>
              </ul>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Service Availability</h2>
            <div className="space-y-4 text-sm">
              <p>
                {site.name} strives to maintain service availability but cannot guarantee:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Uninterrupted access to our service</li>
                <li>Error-free operation at all times</li>
                <li>Compatibility with all browsers or devices</li>
                <li>Availability of specific provider data</li>
              </ul>
              <p>
                We reserve the right to modify, suspend, or discontinue our service at any time.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Governing Law</h2>
            <div className="space-y-4 text-sm">
              <p>
                These Terms of Service are governed by applicable laws. Any disputes will be 
                resolved through binding arbitration where permitted by law.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4 text-sm">
              <p>
                Questions about these Terms of Service:
              </p>
              <div className="space-y-2">
                {site.contactEmail ? (
                  <>
                    <p><strong>Email:</strong> {site.contactEmail}</p>
                    <p><strong>Support:</strong> {site.contactEmail}</p>
                  </>
                ) : (
                  <p>Contact information will be added soon.</p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Terms;