export const site = {
  name: import.meta.env.VITE_APP_NAME || "SoccerFare",
  domain: import.meta.env.VITE_APP_DOMAIN || "https://soccerfare.com",
  // optional (can be empty):
  tagline: import.meta.env.VITE_TAGLINE || "Search MLS, NWSL, and USL. We compare prices and send you to partners to complete purchase.",
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || "",
  twitter: import.meta.env.VITE_TWITTER || "",
  instagram: import.meta.env.VITE_INSTAGRAM || "",
};

export const admin = {
  showAdmin: import.meta.env.VITE_SHOW_ADMIN === "true",
  passcodeHash: import.meta.env.VITE_ADMIN_PASSCODE_HASH || "",
};