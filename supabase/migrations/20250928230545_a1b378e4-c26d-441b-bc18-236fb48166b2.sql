-- Create providers table
CREATE TABLE public.providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  website_url TEXT,
  api_endpoint TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  reliability_score DECIMAL(3,2) DEFAULT 0.85,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id TEXT NOT NULL,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  venue TEXT NOT NULL,
  venue_address TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  competition TEXT,
  league TEXT,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  min_price DECIMAL(10,2),
  max_price DECIMAL(10,2),
  total_tickets INTEGER DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(external_id, home_team, away_team, event_date)
);

-- Create tickets table
CREATE TABLE public.tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES public.providers(id),
  external_ticket_id TEXT,
  section TEXT,
  row_info TEXT,
  seat_info TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  fees DECIMAL(10,2) DEFAULT 0,
  total_price DECIMAL(10,2) NOT NULL,
  delivery_type TEXT CHECK (delivery_type IN ('instant', 'mobile', 'paper')),
  delivery_info TEXT,
  ticket_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create clicks table for analytics
CREATE TABLE public.clicks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  click_id TEXT NOT NULL UNIQUE,
  event_id UUID REFERENCES public.events(id),
  provider_name TEXT NOT NULL,
  price_shown DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  provider_url TEXT,
  clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_agent TEXT,
  referrer TEXT
);

-- Create search history table
CREATE TABLE public.search_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  search_query TEXT NOT NULL,
  location TEXT,
  date_from TIMESTAMP WITH TIME ZONE,
  date_to TIMESTAMP WITH TIME ZONE,
  results_count INTEGER DEFAULT 0,
  user_ip TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is a ticket search app)
CREATE POLICY "Providers are viewable by everyone" ON public.providers FOR SELECT USING (true);
CREATE POLICY "Events are viewable by everyone" ON public.events FOR SELECT USING (true);
CREATE POLICY "Tickets are viewable by everyone" ON public.tickets FOR SELECT USING (true);
CREATE POLICY "Clicks are viewable by everyone" ON public.clicks FOR SELECT USING (true);
CREATE POLICY "Search history is viewable by everyone" ON public.search_history FOR SELECT USING (true);

-- Insert policies for public insert access (for logging)
CREATE POLICY "Anyone can insert clicks" ON public.clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert search history" ON public.search_history FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_events_date ON public.events(event_date);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_league ON public.events(league);
CREATE INDEX idx_events_teams ON public.events(home_team, away_team);
CREATE INDEX idx_tickets_event_available ON public.tickets(event_id, is_available);
CREATE INDEX idx_tickets_price ON public.tickets(total_price);
CREATE INDEX idx_clicks_event ON public.clicks(event_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add update triggers
CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON public.providers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample providers
INSERT INTO public.providers (name, website_url, is_active, reliability_score) VALUES
('SeatGeek', 'https://seatgeek.com', true, 0.90),
('Ticketmaster', 'https://ticketmaster.com', true, 0.95),
('StubHub', 'https://stubhub.com', true, 0.85),
('Vivid Seats', 'https://vividseats.com', true, 0.80);