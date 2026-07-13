// Gabito Energy Solution — Admin Data Store
// All data persists in localStorage. Replace with Supabase in production.

// ── TYPES ────────────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  title: string;
  category: "residential" | "commercial" | "cctv";
  location: string;
  challenge: string;
  solution: string;
  outcome: string;
  thumbnail: string;        // URL or base64
  images: string[];         // additional image URLs
  featured: boolean;
  showOnHomepage: boolean;
  published: boolean;
  completionDate: string;   // ISO date string
  createdAt: string;
  updatedAt: string;
  status: "draft" | "published" | "archived";
}

export interface QuoteRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  propertyType: string;
  service: string;
  location: string;
  challenge: string;
  notes: string;
  status: "new" | "contacted" | "quoted" | "closed";
  createdAt: string;
}

export interface SiteSettings {
  businessPhone: string;
  whatsapp: string;
  email: string;
  address: string;
  hours: string;
  googleMaps: string;
  facebook: string;
  instagram: string;
  linkedin: string;
}

export interface ActivityLog {
  id: string;
  type: "project_added" | "project_updated" | "project_deleted" | "quote_received" | "settings_updated";
  description: string;
  timestamp: string;
}

// ── STORAGE KEYS ─────────────────────────────────────────────────────────────

const K = {
  projects: "gabito_projects",
  quotes: "gabito_quotes",
  settings: "gabito_settings",
  activity: "gabito_activity",
  initialized: "gabito_initialized",
} as const;

// ── DEFAULTS ─────────────────────────────────────────────────────────────────

export const DEFAULT_SETTINGS: SiteSettings = {
  businessPhone: "+2348089100386",
  whatsapp: "2348089100386",
  email: "info@gabitoenergy.com",
  address: "140 Old Onitsha Road, Nnewi, Beside Nenco Filling Station",
  hours: "Monday – Saturday: 8:00 AM – 6:00 PM",
  googleMaps: "",
  facebook: "",
  instagram: "",
  linkedin: "",
};

// ── HELPERS ───────────────────────────────────────────────────────────────────

function safeParse<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function now(): string {
  return new Date().toISOString();
}

// ── STORE ─────────────────────────────────────────────────────────────────────

export const store = {
  // Projects
  getProjects: (): Project[] => safeParse<Project[]>(K.projects, []),
  setProjects: (p: Project[]) => localStorage.setItem(K.projects, JSON.stringify(p)),

  addProject: (p: Project) => {
    const projects = store.getProjects();
    store.setProjects([...projects, p]);
    store.addActivity({ type: "project_added", description: `New project added: ${p.title}` });
  },

  updateProject: (id: string, updates: Partial<Project>) => {
    const projects = store.getProjects().map((p) =>
      p.id === id ? { ...p, ...updates, updatedAt: now() } : p
    );
    store.setProjects(projects);
    const title = store.getProjects().find((p) => p.id === id)?.title ?? id;
    store.addActivity({ type: "project_updated", description: `Project updated: ${title}` });
  },

  deleteProject: (id: string) => {
    const projects = store.getProjects();
    const title = projects.find((p) => p.id === id)?.title ?? id;
    store.setProjects(projects.filter((p) => p.id !== id));
    store.addActivity({ type: "project_deleted", description: `Project deleted: ${title}` });
  },

  // Quotes
  getQuotes: (): QuoteRequest[] => safeParse<QuoteRequest[]>(K.quotes, []),
  setQuotes: (q: QuoteRequest[]) => localStorage.setItem(K.quotes, JSON.stringify(q)),

  updateQuoteStatus: (id: string, status: QuoteRequest["status"]) => {
    store.setQuotes(store.getQuotes().map((q) => (q.id === id ? { ...q, status } : q)));
  },

  deleteQuote: (id: string) => {
    store.setQuotes(store.getQuotes().filter((q) => q.id !== id));
  },

  // Settings
  getSettings: (): SiteSettings => ({
    ...DEFAULT_SETTINGS,
    ...safeParse<Partial<SiteSettings>>(K.settings, {}),
  }),
  setSettings: (s: SiteSettings) => {
    localStorage.setItem(K.settings, JSON.stringify(s));
    store.addActivity({ type: "settings_updated", description: "Business settings updated" });
  },

  // Activity
  getActivity: (): ActivityLog[] => safeParse<ActivityLog[]>(K.activity, []),
  addActivity: (log: Omit<ActivityLog, "id" | "timestamp">) => {
    const logs = store.getActivity();
    const entry: ActivityLog = { ...log, id: `act-${uid()}`, timestamp: now() };
    localStorage.setItem(K.activity, JSON.stringify([entry, ...logs].slice(0, 100)));
  },

  // Initialization
  isInitialized: () => !!localStorage.getItem(K.initialized),
  markInitialized: () => localStorage.setItem(K.initialized, "1"),
};

// ── PUBLIC SITE HELPERS ───────────────────────────────────────────────────────

export const getPublicProjects = (): Project[] =>
  store.getProjects().filter((p) => p.published && p.status === "published");

export const getHomepageProjects = (): Project[] =>
  store.getProjects().filter((p) => p.published && p.featured && p.showOnHomepage && p.status === "published");
