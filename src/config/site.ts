export const site = {
  name: import.meta.env.VITE_APP_NAME || "SoccerFare",
  domain: import.meta.env.VITE_APP_DOMAIN || "https://soccerfare.com",
  // optional (can be empty):
  tagline: import.meta.env.VITE_TAGLINE || "Cheapest soccer tickets, across the web.",
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || "",
  twitter: import.meta.env.VITE_TWITTER || "",
  instagram: import.meta.env.VITE_INSTAGRAM || "",
};