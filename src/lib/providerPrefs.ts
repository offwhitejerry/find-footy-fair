const KEY = "sf_provider_prefs_v1";
export type ProviderPrefs = {
  ticketmaster: boolean;
  // add more providers here as you integrate them
};

const DEFAULTS: ProviderPrefs = { ticketmaster: true }; // default ON if you prefer

export function loadPrefs(): ProviderPrefs {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export function savePrefs(next: ProviderPrefs) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(next));
}