/**
 * Gabito Energy Solution — Admin Dashboard
 * Access via: yoursite.com/#admin
 * Passkey: set VITE_ADMIN_PASSKEY in .env.local (default: Gabito@2024)
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  LayoutDashboard, FolderOpen, MessageSquare, Activity,
  Globe, Settings, LogOut, Sun, Plus, Search, Edit2,
  Trash2, Eye, Copy, X, Check, Phone, MessageCircle,
  MapPin, Clock, Shield, Wifi, Server, Code,
  TrendingUp, Menu, Star, Home, ExternalLink,
  AlertCircle, Camera, Building2, ChevronDown,
  ChevronRight, RefreshCw, Eye as EyeIcon, EyeOff,
  Upload, Link, ToggleLeft, ToggleRight, Filter,
  FileText, Database, Layers, GitBranch, Terminal,
} from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import {
  store, Project, QuoteRequest, SiteSettings, ActivityLog,
  uid, now, getPublicProjects,
} from "./store";
import img1 from "@/imports/IMG-20260616-WA0002_1_.jpg";
import img2 from "@/imports/IMG-20260616-WA0004.jpg";
import img3 from "@/imports/IMG-20260616-WA0008.jpg";
import img4 from "@/imports/IMG-20260616-WA0010.jpg";
import img5 from "@/imports/IMG-20260616-WA0011.jpg";
import img6 from "@/imports/IMG-20260616-WA0012.jpg";
import { Download } from "lucide-react";




// ── CONSTANTS ─────────────────────────────────────────────────────────────────

const PASSKEY = (import.meta as any).env?.VITE_ADMIN_PASSKEY ?? "Gabito@2024";

type AdminPage = "dashboard" | "projects" | "quotes" | "health" | "site-manager" | "settings" | "docs";

// ── SEED DATA ─────────────────────────────────────────────────────────────────

const SEED_PROJECTS: Project[] = [
  { id: "proj-001", title: "AllsparkPower + Firman Hybrid System", category: "residential", location: "Nnewi, Anambra", challenge: "Family home experiencing 18+ hours of daily blackouts.", solution: "2× AllsparkPower lithium batteries + Firman 5kVA hybrid inverter.", outcome: "Full home power for 12+ hours per charge cycle.", thumbnail: img1, images: [], featured: true, showOnHomepage: true, published: true, completionDate: "2026-04-15", createdAt: "2026-04-15T10:00:00Z", updatedAt: "2026-04-15T10:00:00Z", status: "published" },
  { id: "proj-002", title: "Cworth Energy Commercial Array", category: "commercial", location: "Awka, Anambra", challenge: "Business losing revenue from constant power interruptions.", solution: "Multiple Cworth Energy inverters with large battery bank.", outcome: "Uninterrupted operations from 8am to 10pm daily.", thumbnail: img2, images: [], featured: true, showOnHomepage: true, published: true, completionDate: "2026-03-20", createdAt: "2026-03-20T09:00:00Z", updatedAt: "2026-03-20T09:00:00Z", status: "published" },
  { id: "proj-003", title: "Twin Felicity Solar Inverter Setup", category: "commercial", location: "Onitsha, Anambra", challenge: "High energy demand commercial facility needing expanded capacity.", solution: "2× Felicity Solar inverters + 2× Cworth Energy battery units.", outcome: "Heavy commercial loads powered reliably around the clock.", thumbnail: img3, images: [], featured: true, showOnHomepage: true, published: true, completionDate: "2026-02-10", createdAt: "2026-02-10T11:00:00Z", updatedAt: "2026-02-10T11:00:00Z", status: "published" },
  { id: "proj-004", title: "Felicity + LiFePO4 Wall Battery", category: "residential", location: "Nnewi, Anambra", challenge: "Homeowner needed a clean, compact wall-mounted solution.", solution: "Felicity Solar inverter + wall-mounted lithium iron phosphate battery.", outcome: "Compact installation in utility room, zero noise.", thumbnail: img4, images: [], featured: true, showOnHomepage: true, published: true, completionDate: "2026-05-01", createdAt: "2026-05-01T14:00:00Z", updatedAt: "2026-05-01T14:00:00Z", status: "published" },
  { id: "proj-005", title: "Firman Hybrid Wall System", category: "residential", location: "Nkpor, Anambra", challenge: "Small property needing efficient backup power on limited wall space.", solution: "Firman hybrid inverter + Firman 05 wall-mounted battery storage.", outcome: "Reliable 8-hour backup on a compact professionally mounted installation.", thumbnail: img5, images: [], featured: false, showOnHomepage: false, published: true, completionDate: "2026-01-22", createdAt: "2026-01-22T08:00:00Z", updatedAt: "2026-01-22T08:00:00Z", status: "published" },
  { id: "proj-006", title: "LvtopSun LiFePO4 Power Wall", category: "residential", location: "Nnewi, Anambra", challenge: "Customer wanted premium lithium technology with full solar integration.", solution: "Felicity Solar inverter + LytopSun 51.2V 300Ah LiFePO4 power wall.", outcome: "Over 15kWh of clean storage — enough for 24-hour energy independence.", thumbnail: img6, images: [], featured: false, showOnHomepage: false, published: true, completionDate: "2026-06-16", createdAt: "2026-06-16T10:00:00Z", updatedAt: "2026-06-16T10:00:00Z", status: "published" },
];

const SEED_QUOTES: QuoteRequest[] = [
  { id: "q-001", name: "", phone: "", email: "", propertyType: "Home / Residence", service: "Solar Installation", location: "Nnewi, Anambra", challenge: "No NEPA at all", notes: "3 bedrooms, need to power fridge, TV, fans, lights", status: "new", createdAt: "2026-06-28T09:15:00Z" },
  { id: "q-002", name: "", phone: "", email: "", propertyType: "Shop / Retail Store", service: "Inverter & Battery Only", location: "Onitsha, Anambra", challenge: "High generator fuel costs", notes: "Hair salon, need 8-hour backup for all appliances", status: "contacted", createdAt: "2026-06-25T14:30:00Z" },
  { id: "q-003", name: "", phone: "+", email: "", propertyType: "Church / School", service: "Solar Installation", location: "Awka, Anambra", challenge: "Less than 6 hours NEPA daily", notes: "Church auditorium, 500 seats, Sunday services mainly", status: "quoted", createdAt: "2026-06-20T11:00:00Z" },
  { id: "q-004", name: "", phone: "", email: "", propertyType: "Hospital / Pharmacy", service: "Solar Installation", location: "Nnewi, Anambra", challenge: "Business downtime due to power", notes: "Pharmacy needs 24/7 power for medication storage and refrigeration", status: "new", createdAt: "2026-06-29T16:45:00Z" },
  { id: "q-005", name: "", phone: "", email: "", propertyType: "Home / Residence", service: "CCTV Installation", location: "Nkpor, Anambra", challenge: "Security system needs", notes: "4 cameras for home, want remote viewing on phone", status: "contacted", createdAt: "2026-06-22T08:30:00Z" },
];

const SEED_ACTIVITY: ActivityLog[] = [
  { id: "act-001", type: "project_added", description: "New project added: LytopSun LiFePO4 Power Wall", timestamp: "2026-06-16T10:30:00Z" },
  { id: "act-002", type: "quote_received", description: "New quote request from Pharmacist Ifeoma Mbah", timestamp: "2026-06-29T16:45:00Z" },
  { id: "act-003", type: "project_updated", description: "Project updated: AllsparkPower + Firman Hybrid System", timestamp: "2026-06-28T14:00:00Z" },
  { id: "act-004", type: "quote_received", description: "New quote request from Chukwuemeka Okafor", timestamp: "2026-06-28T09:15:00Z" },
  { id: "act-005", type: "settings_updated", description: "Business settings updated", timestamp: "2026-06-20T09:00:00Z" },
];

const CHART_DATA = [
  { month: "Jan", projects: 3, quotes: 8 },
  { month: "Feb", projects: 5, quotes: 12 },
  { month: "Mar", projects: 3, quotes: 5 },
  { month: "Apr", projects: 7, quotes: 15 },
  { month: "May", projects: 3, quotes: 9 },
  { month: "Jun", projects: 6, quotes: 12 },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  if (m > 0) return `${m}m ago`;
  return "just now";
}

function fmtDate(iso: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

const CATEGORY_LABELS: Record<Project["category"], string> = {
  residential: "Residential",
  commercial: "Commercial",
  cctv: "CCTV",
};

const STATUS_BADGE: Record<QuoteRequest["status"], string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  quoted: "bg-purple-100 text-purple-700",
  closed: "bg-gray-100 text-gray-500",
};

const ACTIVITY_ICON: Record<ActivityLog["type"], React.ElementType> = {
  project_added: Plus,
  project_updated: Edit2,
  project_deleted: Trash2,
  quote_received: MessageSquare,
  settings_updated: Settings,
};

const ACTIVITY_COLOR: Record<ActivityLog["type"], string> = {
  project_added: "bg-green-100 text-green-600",
  project_updated: "bg-blue-100 text-blue-600",
  project_deleted: "bg-red-100 text-red-600",
  quote_received: "bg-purple-100 text-purple-600",
  settings_updated: "bg-gray-100 text-gray-600",
};

// ── SHARED UI ─────────────────────────────────────────────────────────────────

function Input({ label, value, onChange, type = "text", placeholder = "", required = false }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#15803D]/25 focus:border-[#15803D] bg-white"
      />
    </div>
  );
}

function Textarea({ label, value, onChange, rows = 3, placeholder = "" }: {
  label: string; value: string; onChange: (v: string) => void;
  rows?: number; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#15803D]/25 focus:border-[#15803D] bg-white resize-none"
      />
    </div>
  );
}

function Toggle({ label, checked, onChange, desc }: {
  label: string; checked: boolean; onChange: (v: boolean) => void; desc?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div>
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${checked ? "bg-[#15803D]" : "bg-gray-200"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );
}

function Badge({ children, color = "bg-gray-100 text-gray-600" }: { children: React.ReactNode; color?: string }) {
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${color}`}>{children}</span>;
}

function Modal({ open, onClose, title, children, wide = false }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-12 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${wide ? "max-w-3xl" : "max-w-xl"} z-10`}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-base">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, sub }: {
  label: string; value: string | number; icon: React.ElementType;
  color: string; sub?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-4.5 h-4.5" />
        </div>
      </div>
      <div className="text-2xl font-extrabold text-gray-900">{value}</div>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

// ── ADMIN LOGIN ───────────────────────────────────────────────────────────────

function AdminLogin({ onAuth }: { onAuth: () => void }) {
  const [key, setKey] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (key === PASSKEY) {
        onAuth();
      } else {
        setError(true);
        setShake(true);
        setTimeout(() => setShake(false), 600);
        setKey("");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#15803D]/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <motion.div
          animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : { x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/[0.04] border border-white/[0.08] rounded-3xl p-8 backdrop-blur-xl shadow-2xl"
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-[#15803D] rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <Sun className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <div className="text-center">
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#4ADE80] mb-1">Gabito Energy Solution</p>
              <h1 className="text-2xl font-extrabold text-white">Welcome Back</h1>
              <p className="text-sm text-gray-400 mt-2">Enter your private Admin Pass-Key to access your dashboard.</p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Admin Pass-Key</label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={key}
                  onChange={(e) => { setKey(e.target.value); setError(false); }}
                  placeholder="Enter your pass-key"
                  autoComplete="current-password"
                  className={`w-full px-4 py-3.5 pr-12 bg-white/[0.06] border rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 transition-all ${error ? "border-red-500/60 focus:ring-red-500/25" : "border-white/10 focus:ring-[#15803D]/40 focus:border-[#15803D]/60"}`}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {show ? <EyeOff className="w-4.5 h-4.5" /> : <EyeIcon className="w-4.5 h-4.5" />}
                </button>
              </div>
              {error && (
                <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Incorrect pass-key. Please try again.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!key || loading}
              className="w-full bg-[#15803D] hover:bg-[#166534] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Unlock Dashboard
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-6">
            Secured admin access · Gabito Energy Solution
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ── SIDEBAR ───────────────────────────────────────────────────────────────────

const NAV_ITEMS: { page: AdminPage; label: string; icon: React.ElementType }[] = [
  { page: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { page: "projects", label: "Projects", icon: FolderOpen },
  { page: "quotes", label: "Quote Requests", icon: MessageSquare },
  { page: "health", label: "Website Health", icon: Activity },
  { page: "site-manager", label: "Site Manager", icon: Globe },
  { page: "settings", label: "Settings", icon: Settings },
];

function AdminSidebar({ page, setPage, onClose }: {
  page: AdminPage; setPage: (p: AdminPage) => void; onClose?: () => void;
}) {
  const logout = () => {
    sessionStorage.removeItem("gabito_admin");
    window.location.hash = "";
    window.location.reload();
  };

  return (
    <div className="flex flex-col h-full bg-[#111827] select-none">
      {/* Logo */}
      <div className="p-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#15803D] rounded-lg flex items-center justify-center shrink-0">
            <Sun className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm">Gabito Energy</div>
            <div className="text-[#4ADE80] text-[9px] tracking-[0.18em] uppercase font-semibold">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = page === item.page;
          return (
            <button
              key={item.page}
              onClick={() => { setPage(item.page); onClose?.(); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                active
                  ? "bg-[#15803D] text-white shadow-sm"
                  : "text-gray-400 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              <item.icon className={`w-4.5 h-4.5 shrink-0 ${active ? "text-white" : ""}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-white/[0.06] space-y-1">
        <button
          onClick={() => { setPage("docs"); onClose?.(); }}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
            page === "docs" ? "bg-[#15803D] text-white" : "text-gray-500 hover:text-white hover:bg-white/[0.06]"
          }`}
        >
          <FileText className="w-4.5 h-4.5" />
          Tech Docs
        </button>
        <a
          href="/#"
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all"
          onClick={(e) => { e.preventDefault(); window.location.hash = ""; window.location.reload(); }}
        >
          <ExternalLink className="w-4.5 h-4.5" />
          View Website
        </a>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4.5 h-4.5" />
          Logout
        </button>
      </div>
    </div>
  );
}

// ── ADMIN LAYOUT ──────────────────────────────────────────────────────────────

function AdminLayout({ page, setPage, children }: {
  page: AdminPage; setPage: (p: AdminPage) => void; children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);


  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
const [canInstall, setCanInstall] = useState(false);

useEffect(() => {
  const handler = (e: any) => {
    e.preventDefault();
    setDeferredPrompt(e);
    setCanInstall(true);
  };

  window.addEventListener("beforeinstallprompt", handler);

  return () => window.removeEventListener("beforeinstallprompt", handler);
}, []);

const handleInstall = async () => {
  if (!deferredPrompt) return;

  deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;

  if (choice?.outcome === "accepted") {
    setCanInstall(false);
    setDeferredPrompt(null);
  }
};

  const PAGE_TITLES: Record<AdminPage, string> = {
    dashboard: "Dashboard",
    projects: "Project Management",
    quotes: "Quote Requests",
    health: "Website Health",
    "site-manager": "Site Manager",
    settings: "Settings",
    docs: "Technical Documentation",
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col w-60 shrink-0 border-r border-gray-900/50 h-screen">
        <AdminSidebar page={page} setPage={setPage} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64 shadow-2xl">
            <AdminSidebar page={page} setPage={setPage} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 h-14 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-gray-900 text-sm sm:text-base">{PAGE_TITLES[page]}</h1>
          </div>
          <div className="flex items-center gap-2">

  <button
  onClick={handleInstall}
  className="flex items-center gap-2 bg-[#15803D] hover:bg-[#166534] text-white rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition-all shadow-md"
>
  <Download className="w-4 h-4 shrink-0" />
  <span className="hidden sm:inline">Install Dashboard</span>
  <span className="sm:hidden">Install</span>
</button>

  <a
    href="https://wa.me/2348109946212"
    target="_blank"
    rel="noopener noreferrer"
    className="hidden sm:flex items-center gap-1.5 bg-[#25D366]/15 text-[#15803D] text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#25D366]/25 transition-colors"
  >
    <MessageCircle className="w-3.5 h-3.5" />
    WhatsApp
  </a>

  <div className="w-8 h-8 bg-[#15803D] rounded-full flex items-center justify-center">
    <span className="text-white text-xs font-bold">G</span>
  </div>

</div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// ── DASHBOARD PAGE ────────────────────────────────────────────────────────────

function DashPage({ setPage }: { setPage: (p: AdminPage) => void }) {
  const projects = store.getProjects();
  const quotes = store.getQuotes();
  const activity = store.getActivity();
  const published = projects.filter((p) => p.published).length;
  const pending = quotes.filter((q) => q.status === "new").length;

  const handleInstall = async () => {
  console.log("Deferred Prompt:", deferredPrompt);

  if (!deferredPrompt) {
    alert("App is not installable yet.");
    return;
  }

  deferredPrompt.prompt();

  const { outcome } = await deferredPrompt.userChoice;

  console.log("Install outcome:", outcome);

  if (outcome === "accepted") {
    setDeferredPrompt(null);
    setCanInstall(false);
  }
};

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Website Status" value="Online" icon={Wifi} color="bg-green-100 text-green-600" sub="All systems running" />
        <StatCard label="SSL Status" value="Active" icon={Shield} color="bg-blue-100 text-blue-600" sub="Certificate valid" />
        <StatCard label="Projects Published" value={published} icon={FolderOpen} color="bg-purple-100 text-purple-600" sub={`${projects.length} total`} />
        <StatCard label="Pending Quotes" value={pending} icon={MessageSquare} color="bg-amber-100 text-amber-600" sub={`${quotes.length} total`} />
        <StatCard label="Domain Renewal" value="Apr 2027" icon={Globe} color="bg-teal-100 text-teal-600" sub="11 months remaining" />
        <StatCard label="Last Updated" value="Today" icon={RefreshCw} color="bg-gray-100 text-gray-600" sub="Website is currently up to date" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Monthly Projects</h3>
              <p className="text-xs text-gray-400">Installations completed per month</p>
            </div>
            <span className="text-[#15803D] font-bold text-sm">2026</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={CHART_DATA} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="gProject" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#15803D" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#15803D" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "12px" }} />
              <Area type="monotone" dataKey="projects" stroke="#15803D" strokeWidth={2.5} fill="url(#gProject)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Monthly Quote Requests</h3>
              <p className="text-xs text-gray-400">Customer inquiries received per month</p>
            </div>
            <span className="text-amber-600 font-bold text-sm">2026</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={CHART_DATA} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "12px" }} />
              <Bar dataKey="quotes" fill="#D97706" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      

     

        {/* Quick actions */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 text-sm mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: "Add New Project", icon: Plus, page: "projects" as AdminPage, color: "bg-green-50 text-green-700 hover:bg-green-100" },
              { label: "View Quote Requests", icon: MessageSquare, page: "quotes" as AdminPage, color: "bg-blue-50 text-blue-700 hover:bg-blue-100" },
              { label: "Update Settings", icon: Settings, page: "settings" as AdminPage, color: "bg-purple-50 text-purple-700 hover:bg-purple-100" },
              { label: "Website Health", icon: Activity, page: "health" as AdminPage, color: "bg-amber-50 text-amber-700 hover:bg-amber-100" },
            ].map((a) => (
              <button
                key={a.label}
                onClick={() => setPage(a.page)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${a.color}`}
              >
                <a.icon className="w-4 h-4" />
                {a.label}
              </button>
            ))}
          </div>

           {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 text-sm mb-4">Recent Activity</h3>
          {activity.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No activity yet.</p>
          ) : (
            <div className="space-y-3">
              {activity.slice(0, 8).map((a) => {
                const Icon = ACTIVITY_ICON[a.type];
                return (
                  <div key={a.id} className="flex items-start gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${ACTIVITY_COLOR[a.type]}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 leading-snug">{a.description}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{timeAgo(a.timestamp)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

          <div className="mt-5 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-3 font-semibold">Recent Quotes</p>
            {quotes.filter((q) => q.status === "new").slice(0, 3).map((q) => (
              <div key={q.id} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-xs font-semibold text-gray-800">{q.name}</p>
                  <p className="text-xs text-gray-400">{q.propertyType}</p>
                </div>
                <Badge color={STATUS_BADGE[q.status]}>{q.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PROJECTS PAGE ─────────────────────────────────────────────────────────────

const BLANK_PROJECT: Omit<Project, "id" | "createdAt" | "updatedAt"> = {
  title: "",
  category: "residential",
  location: "",
  challenge: "",
  solution: "",
  outcome: "",
  thumbnail: "",
  images: [],
  featured: false,
  showOnHomepage: false,
  published: true,
  completionDate: new Date().toISOString().split("T")[0],
  status: "published",
};

function ProjectModal({ open, onClose, initial, onSave }: {
  open: boolean;
  onClose: () => void;
  initial?: Project;
  onSave: (p: Project) => void;
}) {
  const [form, setForm] = useState<Omit<Project, "id" | "createdAt" | "updatedAt">>(
    initial ? { ...initial } : { ...BLANK_PROJECT }
  );
  const [imgUrl, setImgUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setForm(initial ? { ...initial } : { ...BLANK_PROJECT });
  }, [open, initial]);

  const set = (k: keyof typeof form) => (v: any) => setForm((f) => ({ ...f, [k]: v }));

  const addImage = () => {
    if (imgUrl.trim()) {
      setForm((f) => ({ ...f, images: [...f.images, imgUrl.trim()] }));
      setImgUrl("");
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set("thumbnail")(reader.result as string);
    reader.readAsDataURL(file);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const project: Project = {
      ...form,
      id: initial?.id ?? `proj-${uid()}`,
      createdAt: initial?.createdAt ?? now(),
      updatedAt: now(),
    };
    onSave(project);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit Project" : "Add New Project"} wide>
      <form onSubmit={submit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Project Title" value={form.title} onChange={set("title")} required placeholder="e.g. Residential Solar Installation" />
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category<span className="text-red-500 ml-0.5">*</span></label>
            <select value={form.category} onChange={(e) => set("category")(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#15803D]/25 focus:border-[#15803D] bg-white">
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="cctv">CCTV</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Location" value={form.location} onChange={set("location")} placeholder="City, State" required />
          <Input label="Completion Date" value={form.completionDate} onChange={set("completionDate")} type="date" />
        </div>

        <Textarea label="Challenge" value={form.challenge} onChange={set("challenge")} placeholder="What problem did the customer face?" rows={2} />
        <Textarea label="Solution" value={form.solution} onChange={set("solution")} placeholder="What system was installed?" rows={2} />
        <Textarea label="Outcome" value={form.outcome} onChange={set("outcome")} placeholder="What result did the customer achieve?" rows={2} />

        {/* Thumbnail */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Thumbnail Image</label>
          <div className="flex gap-2 mb-2">
            <input
              type="url"
              value={typeof form.thumbnail === "string" && !form.thumbnail.startsWith("data:") ? form.thumbnail : ""}
              onChange={(e) => set("thumbnail")(e.target.value)}
              placeholder="Paste image URL..."
              className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#15803D]/25 focus:border-[#15803D]"
            />
            <button type="button" onClick={() => fileRef.current?.click()}
              className="px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-1.5">
              <Upload className="w-4 h-4" /> Upload
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>
          {form.thumbnail && (
            <div className="relative w-full h-32 bg-gray-100 rounded-xl overflow-hidden">
              <img src={form.thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
              <button type="button" onClick={() => set("thumbnail")("")}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Additional images */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Additional Images</label>
          <div className="flex gap-2 mb-2">
            <input type="url" value={imgUrl} onChange={(e) => setImgUrl(e.target.value)}
              placeholder="Paste image URL..."
              className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#15803D]/25 focus:border-[#15803D]"
            />
            <button type="button" onClick={addImage}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium">
              Add
            </button>
          </div>
          {form.images.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {form.images.map((url, i) => (
                <div key={i} className="relative w-20 h-16 bg-gray-100 rounded-lg overflow-hidden group">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button type="button"
                    onClick={() => setForm((f) => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                    className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Toggles */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-1 border border-gray-100">
          <Toggle label="Featured Project" checked={form.featured} onChange={set("featured")} desc="Highlighted in project listings" />
          <Toggle label="Show on Homepage" checked={form.showOnHomepage} onChange={set("showOnHomepage")} desc="Appears in Recent Installations" />
          <Toggle label="Published" checked={form.published} onChange={set("published")} desc="Visible on public website" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Status</label>
          <select value={form.status} onChange={(e) => set("status")(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#15803D]/25 focus:border-[#15803D] bg-white">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" className="flex-1 py-3 bg-[#15803D] hover:bg-[#166534] text-white rounded-xl text-sm font-bold transition-colors">
            {initial ? "Save Changes" : "Add Project"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function ProjPage() {
  const [projects, setProjects] = useState<Project[]>(store.getProjects);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "residential" | "commercial" | "cctv">("all");
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Project | undefined>();
  const [previewTarget, setPreviewTarget] = useState<Project | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const reload = () => setProjects(store.getProjects());

  const filtered = projects.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q);
    const matchFilter = filter === "all" || p.category === filter;
    return matchSearch && matchFilter;
  });

  const save = (p: Project) => {
    const exists = projects.find((x) => x.id === p.id);
    if (exists) { store.updateProject(p.id, p); }
    else { store.addProject(p); }
    reload();
  };

  const duplicate = (p: Project) => {
    const dup: Project = { ...p, id: `proj-${uid()}`, title: `${p.title} (Copy)`, createdAt: now(), updatedAt: now(), published: false };
    store.addProject(dup);
    reload();
  };

  const confirmDelete = () => {
    if (deleteId) { store.deleteProject(deleteId); setDeleteId(null); reload(); }
  };

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#15803D]/25 focus:border-[#15803D] bg-white" />
        </div>
        <div className="flex gap-2">
          {(["all", "residential", "commercial", "cctv"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold capitalize transition-colors ${filter === f ? "bg-[#15803D] text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}>
              {f === "all" ? `All (${projects.length})` : CATEGORY_LABELS[f]}
            </button>
          ))}
        </div>
        <button onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 bg-[#15803D] hover:bg-[#166534] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shrink-0">
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <FolderOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-500">No projects found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              {/* Thumbnail */}
              <div className="relative h-44 bg-gray-100 overflow-hidden">
                {p.thumbnail ? (
                  <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-300">
                    <FolderOpen className="w-10 h-10" />
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <Badge color={p.category === "residential" ? "bg-blue-100 text-blue-700" : p.category === "commercial" ? "bg-amber-100 text-amber-700" : "bg-purple-100 text-purple-700"}>
                    {CATEGORY_LABELS[p.category]}
                  </Badge>
                  {p.featured && <Badge color="bg-yellow-100 text-yellow-700"><Star className="w-2.5 h-2.5 inline mr-0.5" />Featured</Badge>}
                </div>
                <div className="absolute top-3 right-3">
                  <Badge color={p.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}>
                    {p.published ? "Live" : "Draft"}
                  </Badge>
                </div>
              </div>

              {/* Body */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">{p.title}</h3>
                <p className="text-[#15803D] text-xs flex items-center gap-1 mb-3">
                  <MapPin className="w-3 h-3" />{p.location}
                </p>
                <div className="flex gap-1.5 mb-3">
                  {p.showOnHomepage && <Badge color="bg-green-50 text-green-600"><Home className="w-2.5 h-2.5 inline mr-0.5" />Homepage</Badge>}
                  <Badge color={p.status === "published" ? "bg-green-50 text-green-700" : p.status === "archived" ? "bg-gray-100 text-gray-500" : "bg-amber-50 text-amber-700"}>
                    {p.status}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 pt-3 border-t border-gray-50">
                  <button onClick={() => setPreviewTarget(p)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 border border-gray-100 transition-colors">
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </button>
                  <button onClick={() => setEditTarget(p)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50 border border-blue-100 transition-colors">
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => duplicate(p)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-50 border border-gray-100 transition-colors" title="Duplicate">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteId(p.id)} className="p-2 rounded-lg text-red-400 hover:bg-red-50 border border-red-100 transition-colors" title="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <ProjectModal open={addOpen} onClose={() => setAddOpen(false)} onSave={save} />
      <ProjectModal open={!!editTarget} onClose={() => setEditTarget(undefined)} initial={editTarget} onSave={save} />

      {/* Preview Modal */}
      <Modal open={!!previewTarget} onClose={() => setPreviewTarget(undefined)} title="Project Preview" wide>
        {previewTarget && (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            {previewTarget.thumbnail && (
              <div className="h-52 bg-gray-100 rounded-xl overflow-hidden">
                <img src={previewTarget.thumbnail} alt={previewTarget.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <Badge color="bg-blue-100 text-blue-700">{CATEGORY_LABELS[previewTarget.category]}</Badge>
              {previewTarget.featured && <Badge color="bg-yellow-100 text-yellow-700">⭐ Featured</Badge>}
              {previewTarget.showOnHomepage && <Badge color="bg-green-100 text-green-700">🏠 Homepage</Badge>}
              <Badge color={previewTarget.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}>
                {previewTarget.published ? "Published" : "Draft"}
              </Badge>
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">{previewTarget.title}</h2>
              <p className="text-[#15803D] text-sm flex items-center gap-1 mt-1"><MapPin className="w-3.5 h-3.5" />{previewTarget.location}</p>
            </div>
            {[{ l: "Challenge", v: previewTarget.challenge }, { l: "Solution", v: previewTarget.solution }, { l: "Outcome", v: previewTarget.outcome }].map((row) => (
              <div key={row.l} className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{row.l}</p>
                <p className="text-sm text-gray-700">{row.v}</p>
              </div>
            ))}
            <p className="text-xs text-gray-400">Completed: {fmtDate(previewTarget.completionDate)} · Created: {fmtDate(previewTarget.createdAt)}</p>
          </div>
        )}
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Project">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-6 h-6 text-red-500" />
          </div>
          <p className="font-semibold text-gray-900 mb-2">Are you sure?</p>
          <p className="text-sm text-gray-500 mb-6">This project will be permanently deleted and removed from the website.</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteId(null)} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50">Cancel</button>
            <button onClick={confirmDelete} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-colors">Delete Project</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ── QUOTES PAGE ───────────────────────────────────────────────────────────────

function QuotePage() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>(store.getQuotes);
  const [viewTarget, setViewTarget] = useState<QuoteRequest | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const reload = () => setQuotes(store.getQuotes());

  const markContacted = (id: string) => { store.updateQuoteStatus(id, "contacted"); reload(); };
  const confirmDelete = () => { if (deleteId) { store.deleteQuote(deleteId); setDeleteId(null); reload(); } };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {(["new", "contacted", "quoted", "closed"] as const).map((s) => {
            const count = quotes.filter((q) => q.status === s).length;
            return count > 0 ? (
              <Badge key={s} color={STATUS_BADGE[s]}>{s} ({count})</Badge>
            ) : null;
          })}
        </div>
        <span className="text-sm text-gray-500">{quotes.length} total requests</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Customer", "Phone", "Service", "Location", "Date", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {quotes.map((q) => (
                <tr key={q.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-gray-900">{q.name}</p>
                    {q.email && <p className="text-xs text-gray-400">{q.email}</p>}
                  </td>
                  <td className="px-4 py-3.5">
                    <a href={`tel:${q.phone}`} className="text-[#15803D] font-medium hover:underline">{q.phone}</a>
                  </td>
                  <td className="px-4 py-3.5 text-gray-600 max-w-[140px] truncate">{q.service}</td>
                  <td className="px-4 py-3.5 text-gray-600">{q.location}</td>
                  <td className="px-4 py-3.5 text-gray-500">{fmtDate(q.createdAt)}</td>
                  <td className="px-4 py-3.5">
                    <Badge color={STATUS_BADGE[q.status]}>{q.status}</Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setViewTarget(q)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => markContacted(q.id)} className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Mark Contacted" disabled={q.status !== "new"}>
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteId(q.id)} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {quotes.length === 0 && (
            <div className="p-12 text-center">
              <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="font-semibold text-gray-500">No quote requests yet</p>
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      <Modal open={!!viewTarget} onClose={() => setViewTarget(undefined)} title="Quote Request Details">
        {viewTarget && (
          <div className="space-y-3 text-sm">
            {[
              { l: "Name", v: viewTarget.name },
              { l: "Phone", v: viewTarget.phone },
              { l: "Email", v: viewTarget.email || "Not provided" },
              { l: "Property Type", v: viewTarget.propertyType },
              { l: "Service Needed", v: viewTarget.service },
              { l: "Location", v: viewTarget.location },
              { l: "Main Challenge", v: viewTarget.challenge },
              { l: "Notes", v: viewTarget.notes || "None" },
              { l: "Submitted", v: fmtDate(viewTarget.createdAt) },
            ].map((row) => (
              <div key={row.l} className="flex gap-3">
                <span className="text-xs font-bold text-gray-500 w-28 shrink-0 mt-0.5">{row.l}</span>
                <span className="text-gray-800">{row.v}</span>
              </div>
            ))}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <a href={`tel:${viewTarget.phone}`} className="flex-1 flex items-center justify-center gap-2 bg-[#15803D] text-white font-semibold py-3 rounded-xl text-sm hover:bg-[#166534] transition-colors">
                <Phone className="w-4 h-4" /> Call
              </a>
              <a href={`https://wa.me/${viewTarget.phone.replace(/\D/g, "")}?text=Hello ${encodeURIComponent(viewTarget.name)}, thank you for your quote request. We would like to...`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold py-3 rounded-xl text-sm hover:bg-[#128C7E] transition-colors">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Quote Request">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-6 h-6 text-red-500" />
          </div>
          <p className="font-semibold text-gray-900 mb-2">Delete this quote request?</p>
          <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteId(null)} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50">Cancel</button>
            <button onClick={confirmDelete} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-colors">Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ── HEALTH PAGE ───────────────────────────────────────────────────────────────

function HealthPage() {
  const items = [
    { label: "Website Online", value: "✓ Online", status: "green", icon: Wifi, desc: "Website is accessible globally" },
    { label: "SSL Certificate", value: "✓ Active", status: "green", icon: Shield, desc: "HTTPS enabled, certificate valid" },
    { label: "Hosting Provider", value: "Netlify", status: "neutral", icon: Server, desc: "Static hosting, fast & reliable" },
    { label: "Current Domain", value: "gabitoenergy.com.ng", status: "neutral", icon: Globe, desc: "Primary domain" },
    { label: "Domain Renewal", value: "Apr 2027", status: "green", icon: Clock, desc: "11 months remaining" },
    { label: "Last Deployment", value: "Today", status: "green", icon: RefreshCw, desc: "Website is up to date" },
    { label: "Performance Score", value: "94 / 100", status: "green", icon: TrendingUp, desc: "Lighthouse performance score" },
    { label: "Mobile Ready", value: "✓ Responsive", status: "green", icon: Code, desc: "Fully optimised for mobile" },
  ];

  const COLOR = {
    green: "bg-green-50 border-green-100",
    neutral: "bg-gray-50 border-gray-100",
    warning: "bg-amber-50 border-amber-100",
  } as const;

  const ICON_COLOR = {
    green: "bg-green-100 text-green-600",
    neutral: "bg-gray-100 text-gray-600",
    warning: "bg-amber-100 text-amber-600",
  } as const;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.label} className={`rounded-2xl p-5 border ${COLOR[item.status as keyof typeof COLOR]}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${ICON_COLOR[item.status as keyof typeof ICON_COLOR]}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{item.label}</p>
            <p className="font-extrabold text-gray-900 text-lg">{item.value}</p>
            <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">Deployment History</h3>
        <div className="space-y-3">
          {[
            { label: "v1.3.0 — Admin Dashboard added", date: "Today", status: "success" },
            { label: "v1.2.0 — Project gallery updated", date: "Jun 16, 2026", status: "success" },
            { label: "v1.1.0 — Quote form WhatsApp integration", date: "Jun 1, 2026", status: "success" },
            { label: "v1.0.0 — Initial website launch", date: "May 15, 2026", status: "success" },
          ].map((d) => (
            <div key={d.label} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
              <div className="w-2 h-2 bg-[#15803D] rounded-full shrink-0" />
              <span className="flex-1 text-sm text-gray-700">{d.label}</span>
              <span className="text-xs text-gray-400">{d.date}</span>
              <Badge color="bg-green-100 text-green-700">success</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── SITE MANAGER PAGE ─────────────────────────────────────────────────────────

function SiteMgrPage() {
  const WA_DEV = "https://wa.me/2347039312869?text=Hi%2C%20I%20need%20help%20with%20my%20website%20on%20gabitoenergy.com.";

  const features = [
    { icon: Globe, title: "Homepage Redesign", desc: "Full redesign of the homepage layout, hero section, or service presentations.", tag: "Design" },
    { icon: Plus, title: "New Pages", desc: "Adding new pages like Testimonials, Blog, Product Catalogue, or Landing Pages.", tag: "Development" },
    { icon: TrendingUp, title: "SEO Optimisation", desc: "Technical SEO, meta tags, structured data, sitemaps, and local search ranking.", tag: "SEO" },
    { icon: Activity, title: "Performance Improvements", desc: "Image compression, lazy loading, caching, CDN setup, and Core Web Vitals.", tag: "Performance" },
    { icon: Code, title: "Advanced Animations", desc: "Custom scroll-triggered animations, page transitions, and interactive effects.", tag: "Design" },
    { icon: Database, title: "Backend & Database", desc: "Supabase integration, real-time data, user authentication, and API development.", tag: "Backend" },
    { icon: MessageCircle, title: "WhatsApp Integration", desc: "Advanced chat widgets, automated responses, and CRM integrations.", tag: "Integration" },
    { icon: Shield, title: "Custom Integrations", desc: "Payment gateways, email marketing, analytics, and third-party APIs.", tag: "Integration" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-[#0D1117] rounded-2xl p-7 text-center">
        <Globe className="w-10 h-10 text-[#4ADE80] mx-auto mb-4" />
        <h2 className="text-xl font-extrabold text-white mb-2">Site Management</h2>
        <p className="text-gray-400 text-sm max-w-lg mx-auto">The features below require your site developer. Contact them directly via WhatsApp for any website changes beyond project management.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((f) => (
          <div key={f.title} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <f.icon className="w-5 h-5 text-[#15803D]" />
              </div>
              <Badge color="bg-gray-100 text-gray-500">{f.tag}</Badge>
            </div>
            <h4 className="font-bold text-gray-900 text-sm mb-1.5">{f.title}</h4>
            <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#15803D] rounded-2xl p-8 text-center">
        <h3 className="text-xl font-extrabold text-white mb-2">Need Website Changes?</h3>
        <p className="text-green-100 text-sm mb-6">Contact your site manager directly on WhatsApp for any feature requests, redesigns, or technical improvements.</p>
        <a href={WA_DEV} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 bg-white text-[#15803D] font-bold px-8 py-4 rounded-xl hover:bg-green-50 transition-colors shadow-sm">
          <MessageCircle className="w-5 h-5" />
          Contact Your Site Manager
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

// ── SETTINGS PAGE ─────────────────────────────────────────────────────────────

function SettPage() {
  const [settings, setSettings] = useState<SiteSettings>(store.getSettings);
  const [saved, setSaved] = useState(false);
  const set = (k: keyof SiteSettings) => (v: string) => setSettings((s) => ({ ...s, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    store.setSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={submit} className="space-y-6 max-w-2xl">
      {/* Contact */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Phone className="w-4 h-4 text-[#15803D]" /> Contact Information</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Business Phone" value={settings.businessPhone} onChange={set("businessPhone")} placeholder="+2348109946212" />
            <Input label="WhatsApp Number" value={settings.whatsapp} onChange={set("whatsapp")} placeholder="2348109946212 (no +)" />
          </div>
          <Input label="Email Address" value={settings.email} onChange={set("email")} type="email" placeholder="info@gabitoenergy.com" />
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><MapPin className="w-4 h-4 text-[#15803D]" /> Location & Hours</h3>
        <div className="space-y-4">
          <Textarea label="Office Address" value={settings.address} onChange={set("address")} rows={2} />
          <Input label="Business Hours" value={settings.hours} onChange={set("hours")} placeholder="Monday – Saturday: 8:00 AM – 6:00 PM" />
          <Input label="Google Maps Embed URL" value={settings.googleMaps} onChange={set("googleMaps")} placeholder="https://maps.google.com/..." />
        </div>
      </div>

      {/* Social */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Globe className="w-4 h-4 text-[#15803D]" /> Social Media</h3>
        <div className="space-y-4">
          <Input label="Facebook Page URL" value={settings.facebook} onChange={set("facebook")} placeholder="https://facebook.com/gabitoenergy" />
          <Input label="Instagram Profile URL" value={settings.instagram} onChange={set("instagram")} placeholder="https://instagram.com/gabitoenergy" />
          <Input label="LinkedIn Page URL" value={settings.linkedin} onChange={set("linkedin")} placeholder="https://linkedin.com/company/gabitoenergy" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button type="submit"
          className="flex items-center gap-2 bg-[#15803D] hover:bg-[#166534] text-white font-bold px-8 py-3.5 rounded-xl transition-colors">
          <Check className="w-4 h-4" /> Save Settings
        </button>
        {saved && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-600 text-sm font-semibold flex items-center gap-1.5">
            <Check className="w-4 h-4" /> Settings saved successfully
          </motion.span>
        )}
      </div>
    </form>
  );
}

// ── TECH DOCS PAGE ─────────────────────────────────────────────────────────────

function TechPage() {
  const sections = [
    {
      icon: Layers, title: "1. React Component Tree",
      content: `App.tsx
├── AdminApp (rendered when URL hash = #admin)
│   ├── AdminLogin
│   └── AdminLayout
│       ├── AdminSidebar
│       ├── AdminHeader (mobile)
│       └── Pages
│           ├── DashPage
│           │   ├── StatCard[]
│           │   ├── AreaChart (recharts)
│           │   ├── BarChart (recharts)
│           │   └── ActivityFeed
│           ├── ProjPage
│           │   ├── ProjectCard[]
│           │   ├── ProjectModal (Add / Edit)
│           │   ├── PreviewModal
│           │   └── DeleteModal
│           ├── QuotePage
│           │   ├── QuoteTable
│           │   ├── QuoteDetailModal
│           │   └── DeleteModal
│           ├── HealthPage
│           ├── SiteMgrPage
│           ├── SettPage
│           └── TechPage
└── Public Website (all other routes)`
    },
    {
      icon: FolderOpen, title: "2. Folder Structure",
      content: `src/
  app/
    App.tsx                    # Public site + admin detection
    admin/
      AdminApp.tsx             # Full admin dashboard
      store.ts                 # Data layer (localStorage → Supabase)
    components/
      figma/
        ImageWithFallback.tsx
      ui/
        [shadcn components]
  imports/
    [project images]
  styles/
    fonts.css
    theme.css
    index.css`
    },
    {
      icon: GitBranch, title: "3. Required Routes (React Router)",
      content: `/ → Public Homepage
/solar → Solar Solutions Page
/cctv → CCTV Solutions Page
/projects → Projects Gallery
/about → About Page
/faq → FAQ Page
/contact → Contact Page
/quote → Request Quote Page
/admin → Admin Login (passkey required)
/admin/dashboard → Dashboard
/admin/projects → Project Management
/admin/quotes → Quote Requests
/admin/health → Website Health
/admin/site-manager → Site Manager
/admin/settings → Settings`
    },
    {
      icon: Database, title: "4. Database Schema (Supabase)",
      content: `-- projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT CHECK (category IN ('residential','commercial','cctv')),
  location TEXT,
  challenge TEXT,
  solution TEXT,
  outcome TEXT,
  thumbnail_url TEXT,
  images JSONB DEFAULT '[]',
  featured BOOLEAN DEFAULT FALSE,
  show_on_homepage BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT FALSE,
  status TEXT CHECK (status IN ('draft','published','archived')),
  completion_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- quote_requests table
CREATE TABLE quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  property_type TEXT,
  service TEXT,
  location TEXT,
  challenge TEXT,
  notes TEXT,
  status TEXT CHECK (status IN ('new','contacted','quoted','closed')) DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- settings table
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- activity_log table
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`
    },
    {
      icon: Server, title: "5. Storage Structure (Supabase Storage)",
      content: `Bucket: gabito-media
  /projects/
    /{project-id}/
      thumbnail.jpg
      image-01.jpg
      image-02.jpg
      ...
  /site/
    /logo.png
    /favicon.ico

Access: Public read (CDN-served)
Upload: Authenticated users only (admin)`
    },
    {
      icon: Terminal, title: "6. Required API Endpoints",
      content: `POST   /api/quotes              # Submit new quote request (public site)
GET    /api/quotes              # List all quotes (admin only)
PATCH  /api/quotes/:id          # Update quote status (admin)
DELETE /api/quotes/:id          # Delete quote (admin)

GET    /api/projects            # List published projects (public)
GET    /api/projects/homepage   # Featured homepage projects (public)
POST   /api/projects            # Add project (admin only)
PUT    /api/projects/:id        # Update project (admin)
DELETE /api/projects/:id        # Delete project (admin)

GET    /api/settings            # Get public settings
PUT    /api/settings            # Update settings (admin)

GET    /api/activity            # Activity log (admin)
GET    /api/health              # System health check`
    },
    {
      icon: Shield, title: "7. Validation Rules",
      content: `Projects:
  - title: required, 3–100 chars
  - category: enum [residential, commercial, cctv]
  - location: required, 3–100 chars
  - challenge: required, 10–500 chars
  - solution: required, 10–500 chars
  - outcome: required, 10–500 chars
  - thumbnail: valid URL or base64 image
  - completion_date: valid ISO date, not future

Quote Requests:
  - name: required, 2–80 chars
  - phone: required, valid Nigerian phone (+234 or 0 prefix)
  - email: optional, valid email format
  - property_type: required, enum
  - service: required, enum
  - location: required

Settings:
  - businessPhone: valid phone format
  - whatsapp: digits only (no + prefix)
  - email: valid email
  - all URLs: valid URL format`
    },
    {
      icon: Database, title: "8. Supabase Integration Plan",
      content: `Phase 1: Authentication
  - Replace passkey with Supabase Auth (magic link / OTP)
  - Row Level Security (RLS) for admin-only tables
  - Session management via Supabase session

Phase 2: Data Migration
  - Replace localStorage in store.ts with Supabase client
  - Implement supabase.from('projects').select() etc.
  - Real-time subscriptions for activity feed

Phase 3: Storage
  - Replace URL input with Supabase Storage upload
  - Image resizing via Supabase Image Transformation
  - CDN delivery for all project photos

Phase 4: Edge Functions
  - Quote submission via Supabase Edge Function
  - WhatsApp notification on new quote (via Twilio/WA API)
  - Email notification via Resend

install: npm install @supabase/supabase-js
config: VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY`
    },
    {
      icon: Code, title: "9. Data Models (TypeScript)",
      content: `interface Project {
  id: string;
  title: string;
  category: 'residential' | 'commercial' | 'cctv';
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
  status: 'draft' | 'published' | 'archived';
}

interface QuoteRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  propertyType: string;
  service: string;
  location: string;
  challenge: string;
  notes: string;
  status: 'new' | 'contacted' | 'quoted' | 'closed';
  createdAt: string;
}

interface SiteSettings {
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

interface ActivityLog {
  id: string;
  type: 'project_added' | 'project_updated' | 'project_deleted'
       | 'quote_received' | 'settings_updated';
  description: string;
  timestamp: string;
}`
    },
    {
      icon: Layers, title: "10. Recommended Project Structure",
      content: `src/
  app/
    App.tsx
    admin/
      AdminApp.tsx
      store.ts
      hooks/
        useProjects.ts
        useQuotes.ts
        useSettings.ts
      lib/
        supabase.ts        # Supabase client
        validators.ts      # Zod schemas
    components/
      ui/                  # shadcn/ui components
      figma/               # ImageWithFallback
    pages/                 # Public site pages
  styles/
    fonts.css
    theme.css
    index.css
  types/
    index.ts               # Shared TypeScript types

Key dependencies:
  react + react-dom + react-router-dom
  @supabase/supabase-js
  recharts
  lucide-react
  motion/react
  tailwind-merge + clsx
  zod (for validation)
  @radix-ui/* (accessible primitives)`
    },
  ];

  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="bg-[#0D1117] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <FileText className="w-6 h-6 text-[#4ADE80]" />
          <h2 className="text-lg font-extrabold text-white">Technical Documentation</h2>
        </div>
        <p className="text-gray-400 text-sm">Complete technical specification for the Gabito Energy Solution platform. Hand this to any developer for Supabase backend integration.</p>
      </div>

      {sections.map((s, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button
            onClick={() => setActive(active === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                <s.icon className="w-4 h-4 text-[#15803D]" />
              </div>
              <span className="font-bold text-gray-900 text-sm">{s.title}</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${active === i ? "rotate-180" : ""}`} />
          </button>
          {active === i && (
            <div className="px-5 pb-5">
              <pre className="bg-gray-900 text-green-300 text-xs p-4 rounded-xl overflow-x-auto font-mono leading-relaxed whitespace-pre">
                {s.content}
              </pre>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── MAIN ADMIN APP ────────────────────────────────────────────────────────────

export function AdminApp() {
  const [auth, setAuth] = useState(() => sessionStorage.getItem("gabito_admin") === "1");
  const [page, setPage] = useState<AdminPage>("dashboard");

  // Seed initial data on first run
  useEffect(() => {
    if (!store.isInitialized()) {
      store.setProjects(SEED_PROJECTS);
      store.setQuotes(SEED_QUOTES);
      localStorage.setItem("gabito_activity", JSON.stringify(SEED_ACTIVITY));
      store.markInitialized();
    }
  }, []);

  const handleAuth = () => {
    sessionStorage.setItem("gabito_admin", "1");
    setAuth(true);
  };

  if (!auth) return <AdminLogin onAuth={handleAuth} />;

  return (
    <AdminLayout page={page} setPage={setPage}>
      {page === "dashboard" && <DashPage setPage={setPage} />}
      {page === "projects" && <ProjPage />}
      {page === "quotes" && <QuotePage />}
      {page === "health" && <HealthPage />}
      {page === "site-manager" && <SiteMgrPage />}
      {page === "settings" && <SettPage />}
      {page === "docs" && <TechPage />}
    </AdminLayout>
  );
}
