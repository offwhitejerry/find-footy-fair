-- Insert sample events
INSERT INTO public.events (external_id, home_team, away_team, venue, venue_address, event_date, competition, league, status, min_price, total_tickets) VALUES
('MAN_UTD_ARS_001', 'Manchester United', 'Arsenal', 'Old Trafford', 'Manchester, UK', '2025-01-15 15:00:00+00', 'Premier League', 'Premier League', 'upcoming', 85, 150),
('LIV_CHE_001', 'Liverpool', 'Chelsea', 'Anfield', 'Liverpool, UK', '2025-01-22 17:30:00+00', 'Premier League', 'Premier League', 'upcoming', 95, 120),
('MAN_CITY_TOT_001', 'Manchester City', 'Tottenham', 'Etihad Stadium', 'Manchester, UK', '2025-02-01 16:00:00+00', 'Premier League', 'Premier League', 'upcoming', 110, 80),
('LAFC_MIA_001', 'LAFC', 'Inter Miami', 'BMO Stadium', 'Los Angeles, CA', '2025-03-15 19:00:00+00', 'MLS Regular Season', 'MLS', 'upcoming', 45, 200),
('SEA_POR_001', 'Seattle Sounders', 'Portland Timbers', 'Lumen Field', 'Seattle, WA', '2025-03-22 19:30:00+00', 'MLS Regular Season', 'MLS', 'upcoming', 35, 180);

-- Get provider IDs for sample tickets
DO $$
DECLARE
    seatgeek_id UUID;
    ticketmaster_id UUID;
    stubhub_id UUID;
    event_1_id UUID;
    event_2_id UUID;
    event_3_id UUID;
    event_4_id UUID;
    event_5_id UUID;
BEGIN
    -- Get provider IDs
    SELECT id INTO seatgeek_id FROM providers WHERE name = 'SeatGeek';
    SELECT id INTO ticketmaster_id FROM providers WHERE name = 'Ticketmaster';
    SELECT id INTO stubhub_id FROM providers WHERE name = 'StubHub';
    
    -- Get event IDs
    SELECT id INTO event_1_id FROM events WHERE external_id = 'MAN_UTD_ARS_001';
    SELECT id INTO event_2_id FROM events WHERE external_id = 'LIV_CHE_001';
    SELECT id INTO event_3_id FROM events WHERE external_id = 'MAN_CITY_TOT_001';
    SELECT id INTO event_4_id FROM events WHERE external_id = 'LAFC_MIA_001';
    SELECT id INTO event_5_id FROM events WHERE external_id = 'SEA_POR_001';
    
    -- Insert sample tickets for Manchester United vs Arsenal
    INSERT INTO public.tickets (event_id, provider_id, section, price, currency, fees, total_price, delivery_type, is_available, ticket_url) VALUES
    (event_1_id, seatgeek_id, 'Section 101', 85.00, 'USD', 15.00, 100.00, 'mobile', true, 'https://seatgeek.com/tickets/man-utd-arsenal'),
    (event_1_id, ticketmaster_id, 'Section 102', 90.00, 'USD', 18.00, 108.00, 'mobile', true, 'https://ticketmaster.com/tickets/man-utd-arsenal'),
    (event_1_id, stubhub_id, 'Section 103', 88.00, 'USD', 12.00, 100.00, 'mobile', true, 'https://stubhub.com/tickets/man-utd-arsenal'),
    
    -- Insert sample tickets for Liverpool vs Chelsea
    (event_2_id, seatgeek_id, 'Section 201', 95.00, 'USD', 18.00, 113.00, 'mobile', true, 'https://seatgeek.com/tickets/liverpool-chelsea'),
    (event_2_id, ticketmaster_id, 'Section 202', 100.00, 'USD', 20.00, 120.00, 'instant', true, 'https://ticketmaster.com/tickets/liverpool-chelsea'),
    
    -- Insert sample tickets for Manchester City vs Tottenham
    (event_3_id, seatgeek_id, 'Section 301', 110.00, 'USD', 22.00, 132.00, 'mobile', true, 'https://seatgeek.com/tickets/man-city-tottenham'),
    (event_3_id, stubhub_id, 'Section 302', 115.00, 'USD', 18.00, 133.00, 'mobile', true, 'https://stubhub.com/tickets/man-city-tottenham'),
    
    -- Insert sample tickets for LAFC vs Inter Miami
    (event_4_id, seatgeek_id, 'Section 101', 45.00, 'USD', 8.00, 53.00, 'mobile', true, 'https://seatgeek.com/tickets/lafc-inter-miami'),
    (event_4_id, ticketmaster_id, 'Section 102', 50.00, 'USD', 10.00, 60.00, 'mobile', true, 'https://ticketmaster.com/tickets/lafc-inter-miami'),
    
    -- Insert sample tickets for Seattle Sounders vs Portland Timbers
    (event_5_id, seatgeek_id, 'Section 201', 35.00, 'USD', 7.00, 42.00, 'mobile', true, 'https://seatgeek.com/tickets/seattle-portland'),
    (event_5_id, stubhub_id, 'Section 202', 38.00, 'USD', 6.00, 44.00, 'mobile', true, 'https://stubhub.com/tickets/seattle-portland');
    
END $$;