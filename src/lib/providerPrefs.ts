const KEY = "sf_provider_prefs_v1";
export type ProviderPrefs = { ticketmaster: boolean };
const DEFAULTS: ProviderPrefs = { ticketmaster: true };
export function loadPrefs(): ProviderPrefs {
  if (typeof window === "undefined") return DEFAULTS;
  try { const raw = localStorage.getItem(KEY); return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS; }
  catch { return DEFAULTS; }
}

export function savePrefs(next: ProviderPrefs) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(next));
}