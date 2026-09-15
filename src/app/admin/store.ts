import { supabase } from "../../lib/supabase";

export interface Project {
  id: string;
  title: string;
  category: "residential" | "commercial" | "cctv";
  location: string;
  challenge: string;
  solution: string;
  outcome: string;
  thumbnail: string;
  images: string[];
  featured: boolean;
  showOnHomepage: boolean;
  published: boolean;
  completionDate: string;
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
  type:
    | "project_added"
    | "project_updated"
    | "project_deleted"
    | "quote_received"
    | "settings_updated";
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

// ── SUPABASE PROJECT MAPPER ──────────────────────────────────────────────────

function mapProject(row: any): Project {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    location: row.location,
    challenge: row.challenge ?? "",
    solution: row.solution ?? "",
    outcome: row.outcome ?? "",
    thumbnail: row.thumbnail ?? "",
    images: row.images ?? [],
    featured: row.featured ?? false,
    showOnHomepage: row.show_on_homepage ?? false,
    published: row.published ?? false,
    completionDate: row.completion_date ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    status: row.status,
  };
}

// ── SUPABASE PROJECT FUNCTIONS ───────────────────────────────────────────────

export async function getProjectsFromSupabase(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load projects:", error);
    throw error;
  }

  return (data ?? []).map(mapProject);
}

export async function addProjectToSupabase(
  project: Project
): Promise<Project> {
  const { data, error } = await supabase
    .from("projects")
    .insert({
      id: project.id,
      title: project.title,
      category: project.category,
      location: project.location,
      challenge: project.challenge,
      solution: project.solution,
      outcome: project.outcome,
      thumbnail: project.thumbnail,
      images: project.images,
      featured: project.featured,
      show_on_homepage: project.showOnHomepage,
      published: project.published,
      completion_date: project.completionDate || null,
      created_at: project.createdAt,
      updated_at: project.updatedAt,
      status: project.status,
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to add project:", error);
    throw error;
  }

  return mapProject(data);
}

export async function updateProjectInSupabase(
  id: string,
  updates: Partial<Project>
): Promise<Project> {
  const dbUpdates: Record<string, any> = {
    updated_at: now(),
  };

  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.location !== undefined) dbUpdates.location = updates.location;
  if (updates.challenge !== undefined) dbUpdates.challenge = updates.challenge;
  if (updates.solution !== undefined) dbUpdates.solution = updates.solution;
  if (updates.outcome !== undefined) dbUpdates.outcome = updates.outcome;
  if (updates.thumbnail !== undefined) dbUpdates.thumbnail = updates.thumbnail;
  if (updates.images !== undefined) dbUpdates.images = updates.images;
  if (updates.featured !== undefined) dbUpdates.featured = updates.featured;
  if (updates.showOnHomepage !== undefined) {
    dbUpdates.show_on_homepage = updates.showOnHomepage;
  }
  if (updates.published !== undefined) dbUpdates.published = updates.published;
  if (updates.completionDate !== undefined) {
    dbUpdates.completion_date = updates.completionDate || null;
  }
  if (updates.status !== undefined) dbUpdates.status = updates.status;

  const { data, error } = await supabase
    .from("projects")
    .update(dbUpdates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Failed to update project:", error);
    throw error;
  }

  return mapProject(data);
}

export async function deleteProjectFromSupabase(id: string): Promise<void> {
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Failed to delete project:", error);
    throw error;
  }
}

// ── LOCAL STORE ───────────────────────────────────────────────────────────────
// Kept temporarily for quotes, settings and activity.
// We will migrate these separately.

export const store = {
  // Projects - TEMPORARY LOCAL VERSION
  getProjects: (): Project[] => safeParse<Project[]>(K.projects, []),

  setProjects: (p: Project[]) =>
    localStorage.setItem(K.projects, JSON.stringify(p)),

  addProject: (p: Project) => {
    const projects = store.getProjects();
    store.setProjects([...projects, p]);

    store.addActivity({
      type: "project_added",
      description: `New project added: ${p.title}`,
    });
  },

  updateProject: (id: string, updates: Partial<Project>) => {
    const projects = store.getProjects().map((p) =>
      p.id === id
        ? {
            ...p,
            ...updates,
            updatedAt: now(),
          }
        : p
    );

    store.setProjects(projects);

    const title =
      store.getProjects().find((p) => p.id === id)?.title ?? id;

    store.addActivity({
      type: "project_updated",
      description: `Project updated: ${title}`,
    });
  },

  deleteProject: (id: string) => {
    const projects = store.getProjects();

    const title =
      projects.find((p) => p.id === id)?.title ?? id;

    store.setProjects(
      projects.filter((p) => p.id !== id)
    );

    store.addActivity({
      type: "project_deleted",
      description: `Project deleted: ${title}`,
    });
  },

  // Quotes
  getQuotes: (): QuoteRequest[] =>
    safeParse<QuoteRequest[]>(K.quotes, []),

  setQuotes: (q: QuoteRequest[]) =>
    localStorage.setItem(K.quotes, JSON.stringify(q)),

  updateQuoteStatus: (
    id: string,
    status: QuoteRequest["status"]
  ) => {
    store.setQuotes(
      store
        .getQuotes()
        .map((q) =>
          q.id === id
            ? {
                ...q,
                status,
              }
            : q
        )
    );
  },

  deleteQuote: (id: string) => {
    store.setQuotes(
      store
        .getQuotes()
        .filter((q) => q.id !== id)
    );
  },

  // Settings
  getSettings: (): SiteSettings => ({
    ...DEFAULT_SETTINGS,
    ...safeParse<Partial<SiteSettings>>(
      K.settings,
      {}
    ),
  }),

  setSettings: (s: SiteSettings) => {
    localStorage.setItem(
      K.settings,
      JSON.stringify(s)
    );

    store.addActivity({
      type: "settings_updated",
      description: "Business settings updated",
    });
  },

  // Activity
  getActivity: (): ActivityLog[] =>
    safeParse<ActivityLog[]>(
      K.activity,
      []
    ),

  addActivity: (
    log: Omit<ActivityLog, "id" | "timestamp">
  ) => {
    const logs = store.getActivity();

    const entry: ActivityLog = {
      ...log,
      id: `act-${uid()}`,
      timestamp: now(),
    };

    localStorage.setItem(
      K.activity,
      JSON.stringify(
        [entry, ...logs].slice(0, 100)
      )
    );
  },

  // Initialization
  isInitialized: () =>
    !!localStorage.getItem(
      K.initialized
    ),

  markInitialized: () =>
    localStorage.setItem(
      K.initialized,
      "1"
    ),
};

// ── PUBLIC SITE HELPERS ───────────────────────────────────────────────────────
// Temporary local versions.
// These will be changed to Supabase after the admin dashboard is connected.

export const getPublicProjects = (): Project[] =>
  store
    .getProjects()
    .filter(
      (p) =>
        p.published &&
        p.status === "published"
    );

export const getHomepageProjects = (): Project[] =>
  store
    .getProjects()
    .filter(
      (p) =>
        p.published &&
        p.featured &&
        p.showOnHomepage &&
        p.status === "published"
    );