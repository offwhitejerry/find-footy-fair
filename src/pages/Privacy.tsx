import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { site } from "@/config/site";
import { setPageTitle } from "@/lib/head";

const Privacy = () => {
  useEffect(() => {
    setPageTitle("Privacy Policy");
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
            <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Information We Collect</h2>
            <div className="space-y-4 text-sm">
              <p>
                {site.name} is a search and redirect service that helps you find soccer tickets. 
                We collect minimal information to provide our service:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Search Data:</strong> Your search queries, location preferences, and date filters to provide relevant results</li>
                <li><strong>Click Analytics:</strong> When you click "Buy on [Provider]", we track this click for analytics and affiliate purposes</li>
                <li><strong>Technical Data:</strong> Browser type, IP address, and basic usage analytics to improve our service</li>
                <li><strong>Cookies:</strong> We use essential cookies for site functionality and analytics cookies to understand usage</li>
              </ul>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">How We Use Your Information</h2>
            <div className="space-y-4 text-sm">
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Provide search results and ticket price comparisons</li>
                <li>Track affiliate commissions when you purchase through our partner links</li>
                <li>Analyze usage patterns to improve our service</li>
                <li>Comply with legal obligations and prevent fraud</li>
              </ul>
              <p>
                <strong>We do not:</strong> Store payment information, sell your data to third parties, 
                or track you across other websites beyond our affiliate partnerships.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Information Sharing</h2>
            <div className="space-y-4 text-sm">
              <p>
                We share limited information only in these circumstances:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Affiliate Partners:</strong> When you click through to a provider, they receive a click ID for commission tracking</li>
                <li><strong>Service Providers:</strong> We use analytics services and hosting providers who may access usage data</li>
                <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights</li>
              </ul>
              <p>
                When you click "Buy on [Provider]", you leave our site and are subject to that provider's privacy policy.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Data Retention</h2>
            <div className="space-y-4 text-sm">
              <p>
                We retain data for as long as necessary to provide our service:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Search Data:</strong> Not stored permanently, only used during your session</li>
                <li><strong>Click Data:</strong> Retained for affiliate tracking and analytics (typically 2 years)</li>
                <li><strong>Analytics Data:</strong> Aggregated and anonymized data may be retained indefinitely</li>
              </ul>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Your Rights</h2>
            <div className="space-y-4 text-sm">
              <p>
                You have the following rights regarding your data:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Access:</strong> Request information about data we hold about you</li>
                <li><strong>Correction:</strong> Ask us to correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your data (subject to legal obligations)</li>
                <li><strong>Opt-out:</strong> Disable cookies through your browser settings</li>
              </ul>
              {site.contactEmail && (
                <p>
                  To exercise these rights, contact us at{' '}
                  <a 
                    href={`mailto:${site.contactEmail}`}
                    className="text-primary hover:underline"
                  >
                    {site.contactEmail}
                  </a>
                </p>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Cookies and Tracking</h2>
            <div className="space-y-4 text-sm">
              <p>
                We use cookies for:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how you use our site</li>
                <li><strong>Affiliate Tracking:</strong> Track clicks to partner sites for commission purposes</li>
              </ul>
              <p>
                You can control cookies through your browser settings, but disabling essential cookies may affect site functionality.
              </p>
            </div>
          </Card>

          {site.contactEmail && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
              <div className="space-y-4 text-sm">
                <p>
                  For privacy-related questions or to exercise your rights:
                </p>
                <div className="space-y-2">
                  <p>
                    <strong>Email:</strong>{' '}
                    <a 
                      href={`mailto:${site.contactEmail}`}
                      className="text-primary hover:underline"
                    >
                      {site.contactEmail}
                    </a>
                  </p>
                  <p>
                    <strong>General Support:</strong>{' '}
                    <a 
                      href={`mailto:${site.contactEmail}`}
                      className="text-primary hover:underline"
                    >
                      {site.contactEmail}
                    </a>
                  </p>
                </div>
                <p>
                  We will respond to privacy requests within 30 days.
                </p>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Privacy;