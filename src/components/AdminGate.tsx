import { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { admin } from '@/config/site';

interface AdminGateProps {
  children: React.ReactNode;
}

// SHA256 hash function for browser
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

const AdminGate = ({ children }: AdminGateProps) => {
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if already authenticated
    const adminAuth = localStorage.getItem('ADMIN_OK');
    if (adminAuth === '1' && admin.passcodeHash) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // If no hash is configured, deny access
      if (!admin.passcodeHash) {
        setError('Admin access is not configured');
        setIsLoading(false);
        return;
      }

      // Compute SHA256 hash of entered passcode
      const hashedPasscode = await sha256(passcode.trim());
      
      // Compare with stored hash
      if (hashedPasscode === admin.passcodeHash.toLowerCase()) {
        localStorage.setItem('ADMIN_OK', '1');
        setIsAuthenticated(true);
      } else {
        setError('Invalid passcode');
      }
    } catch (err) {
      setError('Authentication failed');
    } finally {
      setIsLoading(false);
      setPasscode('');
    }
  };

  // If authenticated, render children
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Render authentication form
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-xl font-semibold mb-2">Admin Access</h1>
          <p className="text-sm text-muted-foreground">
            Enter the admin passcode to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="passcode">Passcode</Label>
            <div className="relative">
              <Input
                id="passcode"
                type={showPasscode ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter admin passcode"
                required
                disabled={isLoading}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPasscode(!showPasscode)}
                disabled={isLoading}
              >
                {showPasscode ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !passcode.trim()}
          >
            {isLoading ? 'Verifying...' : 'Access Admin'}
          </Button>
        </form>

        {!admin.passcodeHash && (
          <Alert className="mt-4">
            <AlertDescription className="text-xs">
              Admin access requires VITE_ADMIN_PASSCODE_HASH to be configured
            </AlertDescription>
          </Alert>
        )}
      </Card>
    </div>
  );
};

export default AdminGate;