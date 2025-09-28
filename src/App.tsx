import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Results from "./pages/Results";
import Event from "./pages/Event";
import Legal from "./pages/Legal";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Admin from "./pages/Admin";
import AdminClicks from "./pages/AdminClicks";
import AdminSettings from "./pages/AdminSettings";
import Content from "./pages/Content";
import Providers from "./pages/Providers";
import NotFound from "./pages/NotFound";
import AdminGate from "./components/AdminGate";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/results" element={<Results />} />
          <Route path="/event/:id" element={<Event />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/admin" element={<AdminGate><Admin /></AdminGate>} />
          <Route path="/admin/clicks" element={<AdminGate><AdminClicks /></AdminGate>} />
          <Route path="/admin/providers" element={<AdminGate><Providers /></AdminGate>} />
          <Route path="/admin/settings" element={<AdminGate><AdminSettings /></AdminGate>} />
          <Route path="/content" element={<Content />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;