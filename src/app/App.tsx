import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { AdminApp } from "@/app/admin/AdminApp";
import { getHomepageProjects, getPublicProjects, type Project as AdminProject } from "./admin/store";
import {
  Sun,
  Battery,
  Zap,
  Shield,
  Phone,
  MessageCircle,
  ChevronDown,
  Menu,
  X,
  MapPin,
  CheckCircle,
  ArrowRight,
  Camera,
  Wrench,
  BookOpen,
  Settings,
  Users,
  Award,
  Clock,
  Home,
  Building2,
  LogOut,
  Lock,
} from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

import img1 from "../imports/IMG-20260616-WA0002.jpg";
import img2 from "../imports/IMG-20260616-WA0002_1_.jpg";
import img3 from "../imports/IMG-20260616-WA0004.jpg";
import img4 from "../imports/IMG-20260616-WA0008.jpg";
import img5 from "../imports/IMG-20260616-WA0010.jpg";
import img6 from "../imports/IMG-20260616-WA0011.jpg";
import gabitoLogo from "../imports/gabito-logo.png";
import whatsappIcon from "../imports/whatsapp-icon.png";
import img7 from "../imports/IMG-20260623-WA0009.jpg";
import img8 from "../imports/IMG-20260623-WA0011.jpg";

type Page =
  | "home"
  | "solar"
  | "cctv"
  | "projects"
  | "about"
  | "faq"
  | "contact"
  | "quote"
  | "admin";

const WA = "2348109946212";
const PHONE1 = "+2348089100386";
const PHONE2 = "+2348109946212";
const ADDRESS = "140 Old Onitsha Road, Nnewi, Beside Nenco Filling Station";

function wa(msg = "Hello! I'm interested in your solar solutions.") {
  return `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function useCountUp(target: number, triggered: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!triggered) return;
    let n = 0;
    const step = target / 120;
    const t = setInterval(() => {
      n += step;
      if (n >= target) {
        setCount(target);
        clearInterval(t);
      } else setCount(Math.floor(n));
    }, 16);
    return () => clearInterval(t);
  }, [triggered, target]);
  return count;
}

// ── HEADER ──────────────────────────────────────────────────────────────────
function Header({ page, nav }: { page: Page; nav: (p: Page) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const goAdmin = () => {
    window.location.hash = "admin";
    setOpen(false);
  };

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 56);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const isHome = page === "home";
  const solid = scrolled || !isHome;

  const links: { label: string; page: Page }[] = [
    { label: "Home", page: "home" },
    { label: "Solar", page: "solar" },
    { label: "CCTV", page: "cctv" },
    { label: "Projects", page: "projects" },
    { label: "About", page: "about" },
    { label: "FAQ", page: "faq" },
    { label: "Contact", page: "contact" },
  ];

 

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-400 ${
        solid
          ? "bg-white/96 backdrop-blur-lg shadow-sm border-b border-black/[0.06]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          onClick={() => {
            nav("home");
            setOpen(false);
          }}
          className="flex items-center gap-2.5 shrink-0"
        >
           <div className="w-10 h-10 rounded-lg  py-0.5 overflow-hidden shadow-sm flex items-center justify-center">
                <img
                  src={gabitoLogo}
                  alt="Gabito Energy Logo"
                  className="w-full h-full object-cover"
                />
              </div>
          <div className="leading-none">
            <div
              className={`text-sm font-bold tracking-tight ${solid ? "text-gray-900" : "text-white"}`}
            >
              Gabito Energy
            </div>
            <div
              className={`text-[9px] font-semibold tracking-[0.18em] uppercase ${solid ? "text-[#15803D]" : "text-green-300"}`}
            >
              Solution
            </div>
          </div>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-5">
          {links.map((l) => (
            <button
              key={l.page}
              onClick={() => nav(l.page)}
              className={`text-[13px] font-medium transition-colors ${
                page === l.page
                  ? "text-[#15803D]"
                  : solid
                    ? "text-gray-600 hover:text-gray-900"
                    : "text-white/80 hover:text-white"
              }`}
            >
              {l.label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={wa()}
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden sm:flex items-center gap-1.5 text-[13px] font-semibold px-3.5 py-2 rounded-lg border transition-colors ${
              solid
                ? "border-[#15803D] text-[#15803D] hover:bg-green-50"
                : "border-white/40 text-white hover:bg-white/10"
            }`}
          >
           <img
    src={whatsappIcon}
    alt="WhatsApp"
     className="w-8 h-6"
  />
            WhatsApp
          </a>
          <button
            onClick={() => nav("quote")}
            className="hidden sm:flex items-center gap-1.5 bg-[#15803D] hover:bg-[#166534] text-white text-[13px] font-bold px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            Get Free Quote
          </button>
          <button
            onClick={goAdmin}
            title="Admin Dashboard"
            className={`hidden lg:flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
              solid
                ? "border-gray-200 text-gray-500 hover:border-[#15803D] hover:text-[#15803D] hover:bg-green-50"
                : "border-white/20 text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Admin
          </button>
          <button
            onClick={() => setOpen(!open)}
            className={`lg:hidden p-2 rounded-lg ${solid ? "text-gray-700" : "text-white"}`}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-3 space-y-0.5">
            {links.map((l) => (
              <button
                key={l.page}
                onClick={() => {
                  nav(l.page);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  page === l.page
                    ? "bg-green-50 text-[#15803D]"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <div className="px-4 py-2 border-t border-gray-100">
            <button
              onClick={goAdmin}
              className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <Lock className="w-4 h-4 text-gray-400" />
              Admin Dashboard
            </button>
          </div>
          <div className="px-4 pb-4 pt-1 grid grid-cols-2 gap-2 border-t border-gray-100">
            <button
              onClick={() => {
                nav("quote");
                setOpen(false);
              }}
              className="bg-[#15803D] text-white text-sm font-bold py-3 rounded-xl"
            >
              Get Free Quote
            </button>
            <a
              href={wa()}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[#15803D] text-[#15803D] text-sm font-semibold py-3 rounded-xl flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

// ── WHATSAPP FAB ────────────────────────────────────────────────────────────
function WAFab() {
  return (
    <a
      href={wa()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#cbd1cd] hover:bg-[#128C7E] rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110"
    >
      <img src={whatsappIcon} alt="WhatsApp" className="w-12 h-10" />
    </a>
  );
}

// ── FAQ ITEM ────────────────────────────────────────────────────────────────
function FAQItem({
  q,
  a,
  delay = 0,
}: {
  q: string;
  a: string;
  delay?: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal delay={delay}>
      <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-gray-50 transition-colors"
        >
          <span className="font-semibold text-gray-900 text-sm leading-snug">
            {q}
          </span>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </button>
        <div
          className="overflow-hidden transition-all duration-300"
          style={{ maxHeight: open ? "200px" : "0px" }}
        >
          <p className="px-6 pb-5 text-gray-500 text-sm leading-relaxed">{a}</p>
        </div>
      </div>
    </Reveal>
  );
}

// ── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ nav }: { nav: (p: Page) => void }) {
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsOn, setStatsOn] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setStatsOn(true);
      },
      { threshold: 0.3 },
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const installs = useCountUp(100, statsOn);
  const customers = useCountUp(300, statsOn);

  const services = [
    {
      icon: Sun,
      title: "Solar Installation",
      color: "bg-amber-50 text-amber-600",
      desc: "End-to-end solar panel installation for homes and businesses — from free site assessment to commissioning.",
    },
    {
      icon: Battery,
      title: "Inverters & Batteries",
      color: "bg-green-50 text-green-700",
      desc: "Premium hybrid inverters and lithium iron phosphate batteries for all-day, all-night uninterrupted power.",
    },
    {
      icon: Zap,
      title: "Solar Accessories",
      color: "bg-blue-50 text-blue-600",
      desc: "Cables, charge controllers, mounting structures, and all components for a complete, fully-wired solar system.",
    },
    {
      icon: Camera,
      title: "CCTV Solutions",
      color: "bg-purple-50 text-purple-600",
      desc: "HD surveillance cameras for homes, shops, offices, and commercial properties. Remote viewing included.",
    },
    {
      icon: BookOpen,
      title: "Solar Consultation",
      color: "bg-orange-50 text-orange-600",
      desc: "Free expert energy audit to determine the exact system size and components for your specific situation.",
    },
    {
      icon: Wrench,
      title: "Maintenance & Support",
      color: "bg-teal-50 text-teal-600",
      desc: "Scheduled servicing, emergency repairs, and 24/7 technical support for the lifetime of your system.",
    },
  ];

  const benefits = [
    {
      icon: "💡",
      title: "Cut Generator Costs",
      desc: "Most customers save ₦30,000–₦80,000 monthly by eliminating fuel expenses completely.",
    },
    {
      icon: "🔋",
      title: "24/7 Reliable Power",
      desc: "Lights, fridge, fans, and appliances stay on — even through the longest NEPA outages.",
    },
    {
      icon: "📈",
      title: "Business Continuity",
      desc: "No more downtime. Shops, offices, and pharmacies operate without interruption.",
    },
    {
      icon: "🏠",
      title: "Increases Property Value",
      desc: "A solar installation is a long-term asset that adds real value to your property.",
    },
    {
      icon: "🌿",
      title: "Cleaner & Quieter",
      desc: "No fuel fumes, no generator noise. Better for your family and your community.",
    },
    {
      icon: "⚡",
      title: "Energy Independence",
      desc: "Stop depending on NEPA/PHCN. Take full control of your power supply.",
    },
  ];

  const projects = [
    {
      img: img1,
      title: "Residential Hybrid System",
      location: "Nnewi, Anambra",
      type: "Residential",
      desc: "2× AllsparkPower lithium batteries + Firman 5kVA hybrid inverter for a family home.",
    },
    {
      img: img7,
      title: "Commercial Solar Setup",
      location: "Awka, Anambra",
      type: "Commercial",
      desc: "Multiple LuxpowerTex Energy inverters and large battery bank for a commercial building.",
    },
    {
      img: img3,
      title: "Twin Inverter System",
      location: "Onitsha, Anambra",
      type: "Commercial",
      desc: "2× Felicity Solar inverters paired with Cworth Energy storage units for high-load demands.",
    },
    {
      img: img4,
      title: "Office setup",
      location: "Nnewi, Anambra",
      type: "Office",
      desc: "Felicity Solar inverter with wall-mounted lithium iron phosphate battery — clean and compact.",
    },
  ];

  const homeFaqs = [
    {
      q: "How much does solar installation cost in Nigeria?",
      a: "Our 3kVA solar system costs approximately ₦1.5 million, while the 8kVA solar system is around ₦6.2 million. The final price depends on the specific system size and features you need. We offer free site visits to provide an accurate quote tailored to your requirements.",
    },
    {
      q: "Can solar power my entire house?",
      a: "Yes, with the right system size. For example, our 8kVA system can support multiple appliances including refrigerators, TVs, and ACs, making it suitable to power your entire home reliably after a free energy assessment.",
    },
    {
      q: "How long do solar batteries last?",
      a: "Our systems come with batteries that have a lifespan of approximately 10–15 years, depending on usage and maintenance, with the 8kVA system offering up to 15 years of reliable backup.",
    },
    {
      q: "Do you install nationwide?",
      a: "Yes. While based in Nnewi, we install across Nigeria, including Anambra, Delta, Imo, Enugu, and other states. Contact us to discuss your location and project specifics.",
    },
  ];

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-[100svh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1600&h=1000&fit=crop&auto=format"
            alt="Solar panels on a rooftop"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/65 to-black/40" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-24 pb-16">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-[#15803D]/25 border border-[#15803D]/40 text-green-300 text-[11px] font-semibold tracking-[0.14em] uppercase px-4 py-1.5 rounded-full mb-7"
          >
            <Sun className="w-3.5 h-3.5" />
            Nigeria's Trusted Solar Experts · Nnewi, Anambra
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-extrabold text-white leading-[1.06] tracking-tight mb-6"
          >
            Say Goodbye To
            <br />
            <span className="text-[#4ADE80]">Power Outages</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.48 }}
            className="text-lg sm:text-xl text-white/75 max-w-2xl mx-auto mb-3"
          >
            Affordable, Reliable and Sustainable Solar Solutions for Homes and
            Businesses Across Nigeria.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-sm sm:text-base text-white/50 max-w-xl mx-auto mb-10"
          >
            We supply and install solar systems, inverters, batteries and CCTV
            solutions that keep homes and businesses powered when public
            electricity fails.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <button
              onClick={() => nav("quote")}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#15803D] hover:bg-[#166534] text-white font-bold px-8 py-4 rounded-xl text-base transition-all hover:scale-[1.02] shadow-lg shadow-green-950/40"
            >
              Get Free Solar Assessment
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href={wa(
                "Hello! I'd like to enquire about solar solutions for my property.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 hover:bg-white/18 border border-white/25 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all backdrop-blur-sm"
            >
              <img src={whatsappIcon} alt="WhatsApp" className="w-8 h-6" />
              Chat On WhatsApp
            </a>
          </motion.div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-60">
          <ChevronDown className="w-6 h-6 text-white" />
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="bg-[#15803D] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="relative w-full overflow-hidden">
            {/* scrolling track */}
            <div className="flex w-max animate-scroll gap-8 whitespace-nowrap">
              {[
                "✓ Affordable",
                "✓ Reliable",
                "✓ Sustainable",
                "✓ Nationwide Delivery",
                "✓ Expert Installation",
                "✓ Ongoing Support",
              ]
                .concat([
                  "✓ Affordable",
                  "✓ Reliable",
                  "✓ Sustainable",
                  "✓ Nationwide Delivery",
                  "✓ Expert Installation",
                  "✓ Ongoing Support",
                ]) // duplicate for seamless loop
                .map((t, i) => (
                  <span
                    key={i}
                    className="text-[13px] font-semibold text-white/90 shrink-0"
                  >
                    {t}
                  </span>
                ))}
            </div>
          </div>
        </div>

        {/* animation */}
        <style>{`
    @keyframes scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    .animate-scroll {
      animation: scroll 18s linear infinite;
    }
  `}</style>
      </section>

      {/* SERVICES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="text-center mb-14">
              <p className="text-[#15803D] font-semibold text-xs uppercase tracking-[0.14em] mb-3">
                What We Do
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
                Complete Energy & Security Solutions
              </h2>
              <p className="text-gray-500 text-sm max-w-xl mx-auto leading-relaxed">
                Everything you need to power your home or business reliably —
                from consultation to installation to long-term support.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.07}>
                <div className="group border border-gray-100 rounded-2xl p-7 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${s.color}`}
                  >
                    <s.icon className="w-5.5 h-5.5" strokeWidth={2} />
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">
                    {s.desc}
                  </p>
                  <button
                    onClick={() => nav("quote")}
                    className="text-[#15803D] text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all"
                  >
                    Get a Quote <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY SOLAR */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div>
                <p className="text-[#15803D] font-semibold text-xs uppercase tracking-[0.14em] mb-3">
                  Why Solar?
                </p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-5 leading-tight">
                  Stop Paying For Fuel.
                  <br />
                  Start Generating Your Own Power.
                </h2>
                <p className="text-gray-500 leading-relaxed mb-8 text-sm">
                  Every day you run a generator, you're spending money that
                  doesn't have to go. Solar gives you electricity independence —
                  no fuel, no noise, no NEPA dependency. The system pays for
                  itself within months.
                </p>
                <button
                  onClick={() => nav("solar")}
                  className="inline-flex items-center gap-2 bg-[#15803D] hover:bg-[#166534] text-white font-bold px-6 py-3.5 rounded-xl transition-colors"
                >
                  Learn About Solar <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {benefits.map((b, i) => (
                <Reveal key={b.title} delay={i * 0.06}>
                  <div className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-sm transition-shadow">
                    <span className="text-2xl mb-3 block">{b.icon}</span>
                    <h4 className="font-bold text-gray-900 text-[13px] mb-1">
                      {b.title}
                    </h4>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      {b.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section ref={statsRef} className="py-16 sm:py-20 bg-[#15803D]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            {[
              { value: `${installs}+`, label: "Installations Completed" },
              { value: `${customers}+`, label: "Customers Served" },
              { value: "24/7", label: "Technical Support" },
              { value: "Nationwide", label: "Delivery Coverage" },
            ].map((s) => (
              <div key={s.label} className="px-1 sm:px-2">
                {/* VALUE */}
                <div className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-1 sm:mb-2 tracking-tight leading-none ">
                  {s.value}
                </div>

                {/* LABEL */}
                <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.08em] sm:tracking-[0.1em] text-green-200 leading-snug break-words px-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS PREVIEW */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <p className="text-[#15803D] font-semibold text-xs uppercase tracking-[0.14em] mb-3">
                  Real Work. Real Results.
                </p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                  Recent Installations
                </h2>
              </div>
              <button
                onClick={() => nav("projects")}
                className="flex items-center gap-2 text-[#15803D] font-semibold text-sm hover:underline shrink-0"
              >
                View All Projects <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {projects.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div
                  onClick={() => nav("projects")}
                  className="group cursor-pointer rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative h-52 bg-gray-100 overflow-hidden">
                    <ImageWithFallback
                      src={p.img}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-white/92 text-xs font-semibold text-gray-700 px-2.5 py-1 rounded-full backdrop-blur-sm">
                      {p.type}
                    </span>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-gray-900 text-[13px] mb-1">
                      {p.title}
                    </h4>
                    <p className="text-[#15803D] text-xs font-medium flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3" />
                      {p.location}
                    </p>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY TRUST */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="text-center mb-14">
              <p className="text-[#15803D] font-semibold text-xs uppercase tracking-[0.14em] mb-3">
                Why Gabito?
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
                Why Customers Trust Us
              </h2>
              <p className="text-gray-500 text-sm max-w-xl mx-auto">
                We've earned the trust of hundreds of customers across Nigeria
                by doing the job right — every time.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Award,
                title: "Experienced Technicians",
                desc: "Our installers are trained and have completed hundreds of successful projects across Anambra and beyond.",
              },
              {
                icon: CheckCircle,
                title: "Quality Components Only",
                desc: "We work with brands like Felicity Solar, Firman, AllsparkPower, and Cworth Energy — no substandard equipment.",
              },
              {
                icon: Users,
                title: "Transparent Recommendations",
                desc: "We size your system based on your actual needs. You only pay for what you genuinely need — no upselling.",
              },
              {
                icon: Zap,
                title: "Professional Installation",
                desc: "Every installation is clean, safe, and properly commissioned. Tested before we leave your premises.",
              },
              {
                icon: Clock,
                title: "Reliable After-Sales Support",
                desc: "Issues don't wait for business hours. We respond fast and stay available for the lifetime of your system.",
              },
              {
                icon: MapPin,
                title: "Deep Local Knowledge",
                desc: "Based in Nnewi, we understand, Nigeria's power situation better than any out-of-state company.",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.07}>
                <div className="flex gap-4 p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-sm transition-shadow">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-[#15803D]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-[13px] mb-1">
                      {item.title}
                    </h4>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ PREVIEW */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-[#15803D] font-semibold text-xs uppercase tracking-[0.14em] mb-3">
                Common Questions
              </p>
              <h2 className="text-3xl font-extrabold text-gray-900">
                Frequently Asked Questions
              </h2>
            </div>
          </Reveal>
          <div className="space-y-3">
            {homeFaqs.map((f, i) => (
              <FAQItem key={i} q={f.q} a={f.a} delay={i * 0.07} />
            ))}
          </div>
          <Reveal delay={0.3}>
            <div className="text-center mt-8">
              <button
                onClick={() => nav("faq")}
                className="inline-flex items-center gap-2 text-[#15803D] font-semibold text-sm hover:underline"
              >
                View All Questions <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-[#0D1117]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Reveal>
            <div className="w-16 h-16 bg-[#15803D]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Sun className="w-8 h-8 text-[#4ADE80]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Ready To End Power Problems?
            </h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto mb-10">
              Join 1,000+ homes and businesses across Nigeria that have made the
              switch to reliable, affordable solar with Gabito Energy Solution.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => nav("quote")}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#15803D] hover:bg-[#166534] text-white font-bold px-8 py-4 rounded-xl transition-all hover:scale-[1.02]"
              >
                Get Free Quote <ArrowRight className="w-5 h-5" />
              </button>
              <a
                href={`tel:${PHONE1}`}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/8 hover:bg-white/14 border border-white/15 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
              >
                <Phone className="w-5 h-5" /> Call Now
              </a>
              <a
                href={wa()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-[#25D366] font-semibold px-8 py-4 rounded-xl transition-colors"
              >
                <img src={whatsappIcon} alt="WhatsApp" className="w-10 h-8" />{" "}
                Chat On WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

// ── PROJECTS PAGE ────────────────────────────────────────────────────────────
function ProjectsPage({ nav }: { nav: (p: Page) => void }) {
  const [tab, setTab] = useState<"all" | "residential" | "commercial">("all");

  const all = [
    {
      img: img1,
      title: "AllsparkPower + Firman Hybrid System",
      location: "Nnewi, Anambra",
      type: "residential",
      challenge: "Family home experiencing 18+ hours of daily blackouts.",
      solution:
        "2× AllsparkPower lithium batteries + Firman 5kVA hybrid inverter.",
      outcome: "Full home power for 12+ hours per charge cycle.",
    },
    {
      img: img8,
      title: "LuxpowerTex",
      location: "Awka, Anambra",
      type: "commercial",
      challenge: "Business losing revenue from constant power interruptions.",
      solution: "Multiple inverters with large battery bank.",
      outcome: "Uninterrupted operations from 8am to 10pm daily.",
    },
    {
      img: img3,
      title: "Twin Felicity Solar Inverter Setup",
      location: "Onitsha, Anambra",
      type: "commercial",
      challenge:
        "High energy demand commercial facility needing expanded capacity.",
      solution: "2× Felicity Solar inverters + 2× Cworth Energy battery units.",
      outcome: "Heavy commercial loads powered reliably around the clock.",
    },
    {
      img: img4,
      title: "Felicity + LiFePO4 Wall Battery",
      location: "Nnewi, Anambra",
      type: "residential",
      challenge: "Homeowner needed a clean, compact wall-mounted solution.",
      solution:
        "Felicity Solar inverter + wall-mounted lithium iron phosphate battery.",
      outcome: "Compact installation in dedicated utility room, zero noise.",
    },
    {
      img: img5,
      title: "Firman Hybrid Wall System",
      location: "Nkpor, Anambra",
      type: "residential",
      challenge:
        "Small property needing efficient backup power on limited wall space.",
      solution:
        "Firman hybrid inverter + Firman 05 wall-mounted battery storage.",
      outcome:
        "Reliable 8-hour backup on a compact, professionally mounted installation.",
    },
    {
      img: img6,
      title: "LvtopSun LiFePO4 Power Wall",
      location: "Nnewi, Anambra",
      type: "residential",
      challenge:
        "Customer wanted premium lithium technology with full solar integration.",
      solution:
        "Felicity Solar inverter + LvtopSun 51.2V 300Ah LiFePO4 power wall.",
      outcome:
        "Over 15kWh of clean storage — enough for 24-hour energy independence.",
    },
  ];

  const filtered = tab === "all" ? all : all.filter((p) => p.type === tab);

  return (
    <div className="pt-16">
      <section className="bg-gray-900 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#4ADE80] font-semibold text-xs uppercase tracking-[0.14em] mb-4">
            Portfolio
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Real Installations. Proven Results.
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm">
            Every project here is a real system built by our team— actual
            equipment we've installed for real customers across Nigeria.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-2 mb-10 flex-wrap">
            {(["all", "residential", "commercial"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold capitalize transition-colors ${
                  tab === t
                    ? "bg-[#15803D] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {t === "all"
                  ? `All Projects (${all.length})`
                  : `${t} (${all.filter((p) => p.type === t).length})`}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.06}>
                <div className="group rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="relative h-60 bg-gray-100 overflow-hidden">
                    <ImageWithFallback
                      src={p.img}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span
                      className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full ${
                        p.type === "residential"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {p.type === "residential" ? "Residential" : "Commercial"}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-[15px] mb-1">
                      {p.title}
                    </h3>
                    <p className="text-[#15803D] text-xs font-medium flex items-center gap-1 mb-4">
                      <MapPin className="w-3 h-3" />
                      {p.location}
                    </p>
                    <div className="space-y-1.5 text-xs text-gray-600">
                      <p>
                        <span className="font-semibold text-gray-800">
                          Challenge:{" "}
                        </span>
                        {p.challenge}
                      </p>
                      <p>
                        <span className="font-semibold text-gray-800">
                          Solution:{" "}
                        </span>
                        {p.solution}
                      </p>
                      <p>
                        <span className="font-semibold text-[#15803D]">
                          Outcome:{" "}
                        </span>
                        {p.outcome}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <div className="mt-16 bg-[#F0FDF4] rounded-2xl p-10 text-center border border-green-100">
              <h3 className="text-2xl font-extrabold text-gray-900 mb-3">
                Want Your Property on This List?
              </h3>
              <p className="text-gray-500 text-sm mb-7">
                Request a free site assessment and get a custom system design
                for your home or business.
              </p>
              <button
                onClick={() => nav("quote")}
                className="bg-[#15803D] hover:bg-[#166534] text-white font-bold px-8 py-4 rounded-xl transition-colors"
              >
                Request Free Assessment
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

// ── SOLAR PAGE ───────────────────────────────────────────────────────────────
function SolarPage({ nav }: { nav: (p: Page) => void }) {
  const systems = [
    {
      icon: Home,
      title: "Residential Solar",
      desc: "Custom systems for Nigerian homes. We assess your appliances, usage patterns, and budget to recommend the exact right system size.",
      specs: [
        "1kVA – 10kVA systems",
        "Grid-tied and off-grid options",
        "Full home coverage possible",
        "Battery backup included",
      ],
    },
    {
      icon: Building2,
      title: "Commercial Solar",
      desc: "Larger systems for shops, offices, churches, schools, and hospitals — from small commercial to industrial-grade.",
      specs: [
        "10kVA – 100kVA+",
        "3-phase options available",
        "Load management systems",
        "Remote monitoring possible",
      ],
    },
    {
      icon: Zap,
      title: "Hybrid Systems",
      desc: "Use solar during the day, store excess for night — with seamless automatic switching between solar, battery, and NEPA.",
      specs: [
        "Solar + battery + NEPA integration",
        "Automatic seamless switching",
        "Maximizes self-consumption",
        "Reduces grid dependence",
      ],
    },
    {
      icon: Battery,
      title: "LiFePO4 Battery Storage",
      desc: "Lithium iron phosphate batteries are safer, last longer (3,000–6,000 cycles), and perform better than lead-acid alternatives.",
      specs: [
        "LiFePO4 chemistry",
        "Wall-mounted or floor-standing",
        "10-year+ lifespan",
        "Smart BMS protection",
      ],
    },
  ];

  return (
    <div className="pt-16">
      <section className="bg-[#0D1117] py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#4ADE80] font-semibold text-xs uppercase tracking-[0.14em] mb-4">
            Solar Solutions
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Everything Solar.
            <br />
            Built for Nigeria.
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm mb-8">
            From small home backup systems to large commercial installations, we
            design and install solutions that actually work in Nigeria's
            electricity reality.
          </p>
          <button
            onClick={() => nav("quote")}
            className="bg-[#15803D] hover:bg-[#166534] text-white font-bold px-8 py-4 rounded-xl transition-colors"
          >
            Get Free Solar Assessment
          </button>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {systems.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <div className="border border-gray-100 rounded-2xl p-8 hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-5">
                    <s.icon className="w-6 h-6 text-[#15803D]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {s.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5">
                    {s.desc}
                  </p>
                  <ul className="space-y-2">
                    {s.specs.map((spec) => (
                      <li
                        key={spec}
                        className="flex items-center gap-2 text-sm text-gray-700"
                      >
                        <CheckCircle className="w-4 h-4 text-[#15803D] shrink-0" />
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="bg-gray-50 rounded-2xl p-10">
              <div className="text-center mb-10">
                <p className="text-[#15803D] font-semibold text-xs uppercase tracking-[0.14em] mb-3">
                  How It Works
                </p>
                <h2 className="text-3xl font-extrabold text-gray-900">
                  Our Installation Process
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    n: "01",
                    t: "Free Site Assessment",
                    d: "We visit your property, audit appliances and energy needs, and design the right system at no cost.",
                  },
                  {
                    n: "02",
                    t: "Transparent Quote",
                    d: "A detailed quote with exact components and pricing — no surprises, no hidden costs, ever.",
                  },
                  {
                    n: "03",
                    t: "Professional Installation",
                    d: "Our certified technicians install and cable the system cleanly, safely, and to professional standards.",
                  },
                  {
                    n: "04",
                    t: "Commissioning & Support",
                    d: "Everything tested before we leave. Ongoing support available whenever you need it.",
                  },
                ].map((s, i) => (
                  <Reveal key={s.n} delay={i * 0.1}>
                    <div className="text-center">
                      <div className="text-5xl font-extrabold text-[#15803D]/15 mb-3 font-mono">
                        {s.n}
                      </div>
                      <h4 className="font-bold text-gray-900 text-[15px] mb-2">
                        {s.t}
                      </h4>
                      <p className="text-gray-500 text-xs leading-relaxed">
                        {s.d}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-16 bg-[#15803D]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
            Stop Depending on NEPA
          </h2>
          <p className="text-green-100 text-sm mb-8">
            Get a free solar assessment for your home or business today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => nav("quote")}
              className="bg-white text-[#15803D] font-bold px-8 py-4 rounded-xl hover:bg-green-50 transition-colors"
            >
              Request Free Assessment
            </button>
            <a
              href={wa()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 border border-white/25 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/25 transition-colors flex items-center justify-center gap-2"
            >
              <img src={whatsappIcon} alt="WhatsApp" className="w-8 h-6" /> Chat
              on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── CCTV PAGE ────────────────────────────────────────────────────────────────
function CCTVPage({ nav }: { nav: (p: Page) => void }) {
  return (
    <div className="pt-16">
      <section className="bg-gray-900 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#4ADE80] font-semibold text-xs uppercase tracking-[0.14em] mb-4">
            CCTV Solutions
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Security You Can See
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm">
            Professional CCTV installation for homes, shops, offices, and
            commercial properties across Nigeria.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: Camera,
                title: "HD Cameras",
                color: "bg-purple-50 text-purple-600",
                desc: "1080p and 4K cameras for crisp footage day and night. Indoor and outdoor weatherproof models available.",
              },
              {
                icon: Shield,
                title: "Full Coverage Design",
                color: "bg-blue-50 text-blue-600",
                desc: "We design camera placement to eliminate blind spots and maximize coverage of every area of your property.",
              },
              {
                icon: Settings,
                title: "Remote Viewing",
                color: "bg-green-50 text-green-700",
                desc: "Monitor your property live or review recordings from your phone — anywhere in the world, anytime.",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="border border-gray-100 rounded-2xl p-7 text-center hover:shadow-md transition-all">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 ${item.color}`}
                  >
                    <item.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="bg-gray-50 rounded-2xl p-10 grid lg:grid-cols-2 gap-10 items-start">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-4">
                  Who We Install For
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  We've installed CCTV systems for a wide range of properties
                  across Nnewi and surrounding states.
                </p>
                <ul className="space-y-3">
                  {[
                    "Homes & Residential Estates",
                    "Shops & Retail Stores",
                    "Churches & Schools",
                    "Hospitals & Pharmacies",
                    "Offices & Commercial Buildings",
                    "Hotels & Hospitality Properties",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-sm text-gray-700"
                    >
                      <CheckCircle className="w-4 h-4 text-[#15803D] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                {[
                  {
                    t: "Homes & Properties",
                    d: "Deter criminals. Know what's happening at your property when you're away. Real peace of mind for your family.",
                  },
                  {
                    t: "Businesses & Shops",
                    d: "Reduce theft. Resolve disputes. Monitor staff. Protect your investment with continuous 24/7 surveillance.",
                  },
                  {
                    t: "Solar-Powered CCTV",
                    d: "Combine your CCTV with solar — cameras stay on during NEPA blackouts. Security that never sleeps.",
                  },
                ].map((item) => (
                  <div
                    key={item.t}
                    className="bg-white rounded-xl p-5 border border-gray-100"
                  >
                    <h4 className="font-bold text-gray-900 text-[13px] mb-1">
                      {item.t}
                    </h4>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      {item.d}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
            Secure Your Property Today
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            Request a free site survey and CCTV installation quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => nav("quote")}
              className="bg-[#15803D] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#166534] transition-colors"
            >
              Get Free Quote
            </button>
            <a
              href={wa("I'd like to get a CCTV installation quote.")}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/8 border border-white/15 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-white/14 transition-colors flex items-center justify-center gap-2"
            >
              <img src={whatsappIcon} alt="WhatsApp" className="w-8 h-6" /> Chat
              on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── ABOUT PAGE ───────────────────────────────────────────────────────────────
function AboutPage({ nav }: { nav: (p: Page) => void }) {
  return (
    <div className="pt-16">
      <section className="bg-[#0D1117] py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#4ADE80] font-semibold text-xs uppercase tracking-[0.14em] mb-4">
            About Us
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            We Solve Nigeria's Power Problem
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm">
            Gabito Energy Solution is a solar energy company based in Nnewi,
            Anambra State — serving customers across Nigeria and beyond.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-16 items-start">
          <Reveal>
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-5">
                Our Mission
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5 text-sm">
                To make clean, reliable, and affordable solar energy accessible
                to every Nigerian home and business — ending dependence on
                generators and the unreliable public electricity supply.
              </p>
              <p className="text-gray-600 leading-relaxed mb-5 text-sm">
                We understand that power in Nigeria isn't a luxury — it's a
                business survival issue, a family safety issue, and a daily
                frustration for millions of people. That's why we take our work
                seriously.
              </p>
              <p className="text-gray-600 leading-relaxed text-sm">
                Every installation we do is completed with precision, quality
                components, and a genuine commitment to the customer's long-term
                satisfaction — not just the day of installation.
              </p>
            </div>
          </Reveal>
          <div className="space-y-4">
            {[
              {
                t: "Our Vision",
                d: "To be Nigeria's most trusted energy solutions company — known for quality work, honest recommendations, and exceptional customer service.",
              },
              {
                t: "Our Values",
                d: "Affordability without compromise. Reliability in every installation. Sustainability for Nigeria's future. Transparency in every recommendation we make.",
              },
              {
                t: "Our Commitment",
                d: "We don't disappear after installation. Our team remains available for maintenance, upgrades, and technical support for the full lifetime of your system.",
              },
            ].map((item, i) => (
              <Reveal key={item.t} delay={i * 0.1}>
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-2 text-[15px]">
                    {item.t}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {item.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#F0FDF4]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { v: "100+", l: "Installations" },
              { v: "300+", l: "Customers" },
              { v: "5+", l: "Years Active" },
              { v: "24/7", l: "Support" },
            ].map((s) => (
              <Reveal key={s.l}>
                <div>
                  <div className="text-3xl font-extrabold text-[#15803D] mb-1">
                    {s.v}
                  </div>
                  <div className="text-gray-600 text-sm font-medium">{s.l}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="bg-gray-900 rounded-2xl p-10 text-center">
              <MapPin className="w-8 h-8 text-[#4ADE80] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Visit Our Store in Nnewi
              </h3>
              <p className="text-gray-400 text-sm mb-6">{ADDRESS}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={`tel:${PHONE1}`}
                  className="flex items-center justify-center gap-2 bg-[#15803D] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#166534] transition-colors"
                >
                  <Phone className="w-4 h-4" /> {PHONE1}
                </a>
                <a
                  href={wa()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-white/8 border border-white/15 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/14 transition-colors"
                >
                  <img src={whatsappIcon} alt="WhatsApp" className="w-8 h-6" />{" "}
                  WhatsApp
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

// ── FAQ PAGE ─────────────────────────────────────────────────────────────────
function FAQPage() {
  const faqs = [
    {
      q: "How much does solar installation cost in Nigeria?",
      a: "Costs vary by system size. A basic 1kVA home backup system starts around ₦500,000–₦750,000. A full home system (3–5kVA with lithium batteries) typically ranges from ₦800,000–₦4,000,000. Commercial systems are priced after assessment. We offer free site visits for accurate quotes.",
    },
    {
      q: "How many batteries do I need?",
      a: "It depends on your energy consumption and required backup hours. After auditing your appliances and daily usage, we calculate the exact capacity. Most homes need 2–4 batteries for 8–12 hours of backup.",
    },
    {
      q: "Can solar power my entire house?",
      a: "Yes — when the system is properly sized. We design systems to power your entire home including TV, fans, lights, fridge, and even air conditioners with the right inverter and battery capacity.",
    },
    {
      q: "How long do solar batteries last?",
      a: "The LiFePO4 lithium batteries we install are rated for 3,000–6,000 charge cycles — typically 8–15 years of service life. They significantly outlast standard lead-acid batteries and are safe for indoor installation.",
    },
    {
      q: "Do you install nationwide?",
      a: "Our base is Nnewi, Anambra. We regularly install across Anambra, Delta, Imo, Enugu, and other Southeast/South-South states. Contact us to discuss logistics for your location.",
    },
    {
      q: "Do you offer maintenance services?",
      a: "Yes. We offer scheduled maintenance, emergency repairs, system health checks, and battery capacity testing. We recommend an annual service visit for optimal long-term performance.",
    },
    {
      q: "How do I request a quote?",
      a: "Call +2348089100386, send a WhatsApp message, or fill the quote request form on this website. We'll schedule a free site assessment at your convenience.",
    },
    {
      q: "Can solar power my business?",
      a: "Absolutely. We've installed commercial solar systems for shops, offices, churches, schools, hospitals, and pharmacies. Systems are designed around your specific business load requirements.",
    },
    {
      q: "Do you sell batteries and inverters separately?",
      a: "Yes. You can purchase inverters, batteries, solar panels, charge controllers, cables, and all accessories from our store at 140 Old Onitsha Road, Nnewi.",
    },
    {
      q: "Can I upgrade my system later?",
      a: "Yes — especially our modular lithium battery systems, which are designed to be expandable. We can add batteries or increase inverter capacity as your energy needs grow.",
    },
  ];

  return (
    <div className="pt-16">
      <section className="bg-gray-50 py-20 px-4 border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#15803D] font-semibold text-xs uppercase tracking-[0.14em] mb-4">
            FAQ
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Questions & Answers
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">
            Everything you need to know about our solar and CCTV services.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <FAQItem key={i} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ── CONTACT PAGE ─────────────────────────────────────────────────────────────
function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(
      wa(
        `Hello Gabito Energy Solution!\n\nName: ${form.name}\nPhone: ${form.phone}\n\nMessage: ${form.message}`,
      ),
      "_blank",
    );
    setSent(true);
  };

  return (
    <div className="pt-16">
      <section className="bg-[#0D1117] py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#4ADE80] font-semibold text-xs uppercase tracking-[0.14em] mb-4">
            Contact
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Let's Talk Power
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm">
            Reach us by phone, WhatsApp, or visit our store in Nnewi.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-16">
          <Reveal>
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-8">
                Get In Touch
              </h2>
              <div className="space-y-6">
                {[
                  {
                    icon: Phone,
                    label: "Phone",
                    content: (
                      <>
                        <a
                          href={`tel:${PHONE1}`}
                          className="block text-sm text-gray-600 hover:text-[#15803D]"
                        >
                          {PHONE1}
                        </a>
                        <a
                          href={`tel:${PHONE2}`}
                          className="block text-sm text-gray-600 hover:text-[#15803D]"
                        >
                          {PHONE2}
                        </a>
                      </>
                    ),
                  },
                  {
                    icon: () => (
                      <img
                        src={whatsappIcon}
                        alt="WhatsApp"
                        className="w-8 h-8 object-contain"
                      />
                    ),
                    label: "WhatsApp",
                    content: (
                      <a
                        href={wa()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#15803D] text-sm font-medium hover:underline"
                      >
                        Chat with us on WhatsApp →
                      </a>
                    ),
                  },
                  {
                    icon: MapPin,
                    label: "Address",
                    content: (
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {ADDRESS}
                      </p>
                    ),
                  },
                  {
                    icon: Clock,
                    label: "Hours",
                    content: (
                      <>
                        <p className="text-gray-600 text-sm">
                          Mon–Sat: 8:00 AM – 6:00 PM
                        </p>
                        <p className="text-gray-500 text-sm">
                          Sunday: Emergency support only
                        </p>
                      </>
                    ),
                  },
                ].map((item) => (
                  <div key={item.label} className="flex gap-4">
                    <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-[#15803D]" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm mb-1">
                        {item.label}
                      </p>
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Send a Message
              </h3>
              {sent ? (
                <div className="text-center py-10">
                  <CheckCircle className="w-12 h-12 text-[#15803D] mx-auto mb-4" />
                  <p className="font-bold text-gray-900 mb-2">Message Sent!</p>
                  <p className="text-gray-500 text-sm">
                    We'll respond on WhatsApp shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#15803D]/25 focus:border-[#15803D] bg-white"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#15803D]/25 focus:border-[#15803D] bg-white"
                      placeholder="+234 XXX XXX XXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#15803D]/25 focus:border-[#15803D] bg-white resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#15803D] hover:bg-[#166534] text-white font-bold py-4 rounded-xl transition-colors"
                  >
                    Send via WhatsApp
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

// ── QUOTE PAGE ───────────────────────────────────────────────────────────────
function QuotePage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    property: "",
    service: "",
    challenge: "",
    notes: "",
  });
  const [done, setDone] = useState(false);
  const set =
    (k: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `QUOTE REQUEST\n\nName: ${form.name}\nPhone: ${form.phone}\nLocation: ${form.location}\nProperty: ${form.property}\nService: ${form.service}\nChallenge: ${form.challenge}\nNotes: ${form.notes}`;
    window.open(wa(msg), "_blank");
    setDone(true);
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <section className="bg-[#15803D] py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-green-200 font-semibold text-xs uppercase tracking-[0.14em] mb-4">
            Free Assessment
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Request Your Free Assessment
          </h1>
          <p className="text-green-100 text-sm">
            No obligation. No hidden costs. An honest recommendation for your
            situation.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {done ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <CheckCircle className="w-16 h-16 text-[#15803D] mx-auto mb-5" />
              <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                Request Submitted!
              </h2>
              <p className="text-gray-500 text-sm">
                Your quote request was sent via WhatsApp. Our team will contact
                you within 24 hours to schedule your free site assessment.
              </p>
            </div>
          ) : (
            <form
              onSubmit={submit}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-5"
            >
              {[
                { k: "name", l: "Full Name", t: "text", ph: "Your full name" },
                {
                  k: "phone",
                  l: "Phone Number",
                  t: "tel",
                  ph: "+234 XXX XXX XXXX",
                },
                {
                  k: "location",
                  l: "Your Location",
                  t: "text",
                  ph: "State and city (e.g. Nnewi, Anambra)",
                },
              ].map((f) => (
                <div key={f.k}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {f.l}
                  </label>
                  <input
                    type={f.t}
                    required
                    value={(form as any)[f.k]}
                    onChange={set(f.k)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#15803D]/25 focus:border-[#15803D]"
                    placeholder={f.ph}
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Property Type
                </label>
                <select
                  required
                  value={form.property}
                  onChange={set("property")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#15803D]/25 focus:border-[#15803D] bg-white"
                >
                  <option value="">Select property type</option>
                  {[
                    "Home / Residence",
                    "Shop / Retail Store",
                    "Office",
                    "Church / School",
                    "Hospital / Pharmacy",
                    "Hotel",
                    "Commercial Building",
                    "Other",
                  ].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Service Needed
                </label>
                <select
                  required
                  value={form.service}
                  onChange={set("service")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#15803D]/25 focus:border-[#15803D] bg-white"
                >
                  <option value="">Select service</option>
                  {[
                    "Solar Installation",
                    "Inverter & Battery Only",
                    "Solar Accessories",
                    "CCTV Installation",
                    "Solar Consultation",
                    "Maintenance / Repair",
                    "Other",
                  ].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Biggest Electricity Challenge
                </label>
                <select
                  value={form.challenge}
                  onChange={set("challenge")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#15803D]/25 focus:border-[#15803D] bg-white"
                >
                  <option value="">Select your main challenge</option>
                  {[
                    "Less than 6 hours NEPA daily",
                    "No NEPA at all",
                    "High generator fuel costs",
                    "Frequent equipment damage",
                    "Business downtime due to power",
                    "Security system needs",
                  ].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Additional Information{" "}
                  <span className="font-normal text-gray-400">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={set("notes")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#15803D]/25 focus:border-[#15803D] resize-none"
                  placeholder="List your key appliances or anything else we should know..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#15803D] hover:bg-[#166534] text-white font-bold py-4 rounded-xl transition-colors text-base"
              >
                Request Free Assessment →
              </button>
              <p className="text-center text-xs text-gray-400">
                Opens WhatsApp with your details. We respond within 24 hours.
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

// ── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({ nav }: { nav: (p: Page) => void }) {
  return (
    <footer className="bg-[#0D1117]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-white/[0.07]">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-lg bg-[#15803D] py-0.5 overflow-hidden shadow-sm flex items-center justify-center">
                <img
                  src={gabitoLogo}
                  alt="Gabito Energy Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-white font-bold text-sm">
                  Gabito Energy
                </div>
                <div className="text-[#4ADE80] text-[9px] tracking-[0.18em] uppercase font-semibold">
                  Solution
                </div>
              </div>
            </div>
            <p className="text-[13px] leading-relaxed text-gray-500 mb-5">
              Smarter Energy Solutions. Solar systems, inverters, batteries, and
              CCTV for homes and businesses across Nigeria.
            </p>
            <a
              href={wa()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366]/15 text-[#25D366] text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-[#25D366]/25 transition-colors"
            >
              <img src={whatsappIcon} alt="WhatsApp" className="w-8 h-6" /> Chat
              on WhatsApp
            </a>
          </div>

          <div>
            <h4 className="text-white font-semibold text-[13px] mb-4">
              Services
            </h4>
            <ul className="space-y-2.5">
              {[
                ["Solar Installation", "solar"],
                ["CCTV Solutions", "cctv"],
                ["Inverters & Batteries", "solar"],
                ["Solar Consultation", "quote"],
                ["Maintenance & Support", "contact"],
              ].map(([l, p]) => (
                <li key={l}>
                  <button
                    onClick={() => nav(p as Page)}
                    className="text-gray-500 hover:text-white text-[13px] transition-colors"
                  >
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-[13px] mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {[
                ["Home", "home"],
                ["Projects", "projects"],
                ["About Us", "about"],
                ["FAQ", "faq"],
                ["Get Free Quote", "quote"],
              ].map(([l, p]) => (
                <li key={l}>
                  <button
                    onClick={() => nav(p as Page)}
                    className="text-gray-500 hover:text-white text-[13px] transition-colors"
                  >
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-[13px] mb-4">
              Contact
            </h4>
            <div className="space-y-3">
              <div className="flex gap-2.5">
                <MapPin className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                <p className="text-gray-500 text-[13px] leading-relaxed">
                  {ADDRESS}
                </p>
              </div>
              <div className="flex gap-2.5">
                <Phone className="w-4 h-4 text-[#15803D] shrink-0" />
                <div>
                  <a
                    href={`tel:${PHONE1}`}
                    className="text-gray-500 hover:text-white text-[13px] block transition-colors"
                  >
                    {PHONE1}
                  </a>
                  <a
                    href={`tel:${PHONE2}`}
                    className="text-gray-500 hover:text-white text-[13px] block transition-colors"
                  >
                    {PHONE2}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-[12px] text-gray-600">
          <p>
            © {new Date().getFullYear()} Gabito Energy Solution. All rights
            reserved.
          </p>
          <p>Nnewi, Anambra State, Nigeria · Nationwide Delivery</p>
        </div>
      </div>
    </footer>
  );
}

// ── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  // All hooks must be declared before any conditional returns
  const [isAdmin, setIsAdmin] = useState(() => window.location.hash.startsWith("#admin"));
  const [page, setPage] = useState<Page>("home");

  useEffect(() => {
    const fn = () => setIsAdmin(window.location.hash.startsWith("#admin"));
    window.addEventListener("hashchange", fn);
    return () => window.removeEventListener("hashchange", fn);
  }, []);

  const nav = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isAdmin) return <AdminApp />;

  return (
    <div className="min-h-screen">
      <Header page={page} nav={nav} />
      <main>
        {page === "home" && <HomePage nav={nav} />}
        {page === "solar" && <SolarPage nav={nav} />}
        {page === "cctv" && <CCTVPage nav={nav} />}
        {page === "projects" && <ProjectsPage nav={nav} />}
        {page === "about" && <AboutPage nav={nav} />}
        {page === "faq" && <FAQPage />}
        {page === "contact" && <ContactPage />}
        {page === "quote" && <QuotePage />}
      </main>
      <Footer nav={nav} />
      <WAFab />
    </div>
  );
}
