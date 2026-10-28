
import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { supabase } from "./../lib/supabase";
import { AdminApp } from "./admin/AdminApp";
import {
  getProjectsFromSupabase,
  type Project as AdminProject,
} from "./admin/store";

import {
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
  Settings,
  Home,
  Building2,
  Lock,
  Clock,
} from "lucide-react";

import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

import gabitoLogo from "../imports/gabito-logo.png";
import whatsappIcon from "../imports/whatsapp-icon.png";

type Page =
  | "home"
  | "solar"
  | "cctv"
  | "projects"
  | "about"
  | "faq"
  | "contact"
  | "quote"
  | "store"
  | "admin";

const WA = "2348109946212";
const PHONE1 = "+2348089100386";
const PHONE2 = "+2348109946212";
const ADDRESS = "140 Old Onitsha Road, Nnewi, Beside Nenco Filling Station";

function wa(msg = "Hello! I'm interested in your solar solutions.") {
  return `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
}

// ── REVEAL ANIMATION ────────────────────────────────────────────────────────

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
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── COUNT UP ─────────────────────────────────────────────────────────────────

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
      } else {
        setCount(Math.floor(n));
      }
    }, 16);

    return () => clearInterval(t);
  }, [triggered, target]);

  return count;
}

// ── HEADER ───────────────────────────────────────────────────────────────────

function Header({
  page,
  nav,
}: {
  page: Page;
  nav: (p: Page) => void;
}) {
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
    { label: "Store", page: "store" },
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

        {/* LOGO */}

        <button
          onClick={() => {
            nav("home");
            setOpen(false);
          }}
          className="flex items-center gap-2.5 shrink-0"
        >
          <div className="w-10 h-10 rounded-lg py-0.5 overflow-hidden shadow-sm flex items-center justify-center">
            <img
              src={gabitoLogo}
              alt="Gabito Energy Logo"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="leading-none">
            <div
              className={`text-sm font-bold tracking-tight ${
                solid ? "text-gray-900" : "text-white"
              }`}
            >
              Gabito Energy
            </div>

            <div
              className={`text-[9px] font-semibold tracking-[0.18em] uppercase ${
                solid ? "text-[#15803D]" : "text-green-300"
              }`}
            >
              Solution
            </div>
          </div>
        </button>

        {/* DESKTOP NAV */}

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

        {/* ACTIONS */}

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
            Get Quote
          </button>

         

          <button
            onClick={() => setOpen(!open)}
            className={`lg:hidden p-2 rounded-lg ${
              solid ? "text-gray-700" : "text-white"
            }`}
          >
            {open ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}

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
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>

          </div>
        </div>
      )}
    </header>
  );
}

// ── WHATSAPP FAB ─────────────────────────────────────────────────────────────

function WAFab() {
  return (
    <a
      href={wa()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-26 right-6 z-50 w-14 h-14 bg-[#cbd1cd] hover:bg-[#128C7E] rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110"
    >
      <img
        src={whatsappIcon}
        alt="WhatsApp"
        className="w-12 h-10"
      />
    </a>
  );
}

// ── FAQ ITEM ─────────────────────────────────────────────────────────────────

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
            className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        <div
          className="overflow-hidden transition-all duration-300"
          style={{
            maxHeight: open ? "200px" : "0px",
          }}
        >
          <p className="px-6 pb-5 text-gray-500 text-sm leading-relaxed">
            {a}
          </p>
        </div>

      </div>
    </Reveal>
  );
}

// ── HOME PAGE ─────────────────────────────────────────────────────────────────

function HomePage({ nav }: { nav: (p: Page) => void }) {
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsOn, setStatsOn] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsOn(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    if (statsRef.current) statsRef.current && obs.observe(statsRef.current);

    return () => obs.disconnect();
  }, []);

  const installs = useCountUp(100, statsOn);
  const customers = useCountUp(300, statsOn);

  const services = [
    {
      number: "01",
      title: "Solar Systems",
      desc: "Complete solar power systems designed around the appliances, lifestyle and energy demands of your property.",
      action: () => nav("solar"),
    },
    {
      number: "02",
      title: "Inverters & Storage",
      desc: "Reliable inverter and battery combinations for dependable backup and better control over your electricity.",
      action: () => nav("solar"),
    },
    {
      number: "03",
      title: "Solar Components",
      desc: "Panels, charge controllers, mounting systems and the essential components required for a properly engineered installation.",
      action: () => nav("solar"),
    },
    {
      number: "04",
      title: "CCTV & Security",
      desc: "Modern surveillance systems for homes, offices, shops and commercial properties.",
      action: () => nav("quote"),
    },
    {
      number: "05",
      title: "Energy Assessment",
      desc: "We assess your actual energy requirements before recommending the system you should buy.",
      action: () => nav("quote"),
    },
    {
      number: "06",
      title: "Maintenance",
      desc: "Technical support, servicing and system maintenance that keeps your investment performing.",
      action: () => nav("quote"),
    },
  ];

  const benefits = [
    {
      number: "01",
      title: "Spend less on fuel",
      desc: "Move essential loads away from expensive generator fuel and towards solar energy.",
    },
    {
      number: "02",
      title: "Keep important things running",
      desc: "Protect your home, business and equipment from unnecessary power interruptions.",
    },
    {
      number: "03",
      title: "Build for the long term",
      desc: "Quality components and proper installation create systems designed to serve for years.",
    },
    {
      number: "04",
      title: "Know what you're buying",
      desc: "Our recommendations are based on your actual energy needs rather than unnecessary upgrades.",
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

  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [latestProducts, setLatestProducts] = useState<StoreProduct[]>([]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjectsFromSupabase();

        const recentProjects = data
          .filter((project) => project.published)
          .slice(0, 4);

        setProjects(recentProjects);
      } catch (error) {
        console.error("Failed to load homepage projects:", error);
      }
    };

    void loadProjects();
  }, []);

  // Load the six latest published products
  useEffect(() => {
    async function loadLatestProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("published", true)
        .order("updated_at", { ascending: false })
        .limit(6);

      if (error) {
        console.error("Failed to load homepage products:", error);
        return;
      }

      setLatestProducts((data ?? []) as StoreProduct[]);
    }

    void loadLatestProducts();
  }, []);

  return (
    <div className="bg-[#f3f1e9] text-[#101511] overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-[100svh] bg-[#101511] text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=2200&h=1500&fit=crop&auto=format"
            alt="Solar installation"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-[#07100b]/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07100b]/95 via-[#07100b]/55 to-[#07100b]/10" />
        </div>

        <div className="absolute top-24 left-5 sm:left-8 lg:left-14 z-10">
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.24em] text-white/65">
              Gabito Energy Solution
            </span>
          </div>
        </div>

        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 z-10">
          <span
            className="text-[9px] uppercase tracking-[0.3em] text-white/45"
            style={{ writingMode: "vertical-rl" }}
          >
            Power · Storage · Security · Nigeria
          </span>
        </div>

        <div className="relative z-10 min-h-[100svh] max-w-[1550px] mx-auto px-5 sm:px-8 lg:px-14 flex items-end pb-10 sm:pb-14 lg:pb-16">
          <div className="w-full">
            <Reveal>
              <div className="max-w-6xl">
                <h1 className="text-[clamp(4rem,10vw,10rem)] leading-[0.78] tracking-[-0.07em] font-semibold">
                  Power
                  <br />
                  <span className="text-[#8bdc65]">without</span>
                  <br />
                  compromise.
                </h1>
              </div>
            </Reveal>

            <div className="mt-10 grid lg:grid-cols-[1fr_auto] gap-8 items-end">
              <Reveal delay={0.15}>
                <p className="text-sm sm:text-base lg:text-lg text-white/65 leading-7 max-w-xl">
                  Solar energy systems, power storage and security solutions
                  engineered for Nigerian homes and businesses.
                </p>
              </Reveal>

              <Reveal delay={0.25}>
                <button
                  onClick={() => nav("quote")}
                  className="group flex items-center gap-4 text-sm font-semibold"
                >
                  <span className="w-10 h-10 mb-4 rounded-full bg-[#8bdc65] text-[#101511] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <ArrowRight className="w-5 h-5" />
                  </span>

                  <span className="text-white">Start your solar project</span>
                </button>
              </Reveal>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="max-w-[1550px] mx-auto px-5 sm:px-8 lg:px-14">
            <div className="border-t border-white/15 py-4 flex flex-col sm:flex-row gap-3 justify-between">
              <span className="text-[10px] uppercase tracking-[0.18em] text-white/45">
                Nnewi, Anambra
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="bg-[#f3f1e9] py-14 lg:py-26">
        <div className="max-w-[1550px] mx-auto px-5 sm:px-8 lg:px-14">
          <div className="grid lg:grid-cols-[0.35fr_1.65fr] gap-10 lg:gap-20">
            <Reveal>
              <div className="flex items-center gap-3 lg:pt-4">
                <span className="text-[10px] uppercase tracking-[0.22em] text-black/45">
                  The problem
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div>
                <h2 className="text-[clamp(2.5rem,5.5vw,6rem)] leading-[0.93] tracking-[-0.06em] font-medium max-w-6xl">
                  Electricity shouldn't dictate
                  <span className="text-[#15803D]">
                    {" "}how your life works.
                  </span>
                </h2>

                <div className="mt-6 grid md:grid-cols-2 gap-8 max-w-4xl">
                  <p className="text-sm lg:text-base leading-7 text-black/55">
                    Power cuts cost more than electricity. They interrupt
                    businesses, damage equipment, disturb homes and force
                    people to spend heavily on generators and fuel.
                  </p>

                  <p className="text-sm lg:text-base leading-7 text-black/55">
                    We design systems that give you another option — reliable
                    energy that is sized around your real needs and installed
                    properly from the beginning.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-[#191e1a] text-white py-24 lg:py-32">
        <div className="max-w-[1550px] mx-auto px-5 sm:px-8 lg:px-14">
          <Reveal>
            <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-8 mb-16">
              <div>
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#8bdc65]">
                  What we build
                </span>

                <h2 className="mt-5 text-[clamp(3rem,6vw,6.5rem)] leading-[0.85] tracking-[-0.06em] font-medium">
                  Built around
                  <br />
                  your needs.
                </h2>
              </div>

              <p className="text-sm leading-7 text-white/45 max-w-sm">
                There is no single solar system for everybody. We help you
                choose the right combination of power generation, storage and
                security.
              </p>
            </div>
          </Reveal>

          <div className="border-t border-white/15">
            {services.map((service, index) => (
              <Reveal key={service.title} delay={index * 0.05}>
                <button
                  onClick={service.action}
                  className="w-full text-left group border-b border-white/15 py-7 lg:py-9 grid lg:grid-cols-[100px_1fr_1fr_60px] gap-5 lg:gap-10 items-center hover:bg-white/[0.025] transition-colors"
                >
                  <span className="text-xs text-[#8bdc65]/70">
                    {service.number}
                  </span>

                  <h3 className="text-2xl sm:text-3xl lg:text-4xl tracking-[-0.035em] font-medium group-hover:text-[#8bdc65] transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-sm leading-6 text-white/45 max-w-md">
                    {service.desc}
                  </p>

                  <span className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-[#8bdc65] group-hover:text-[#101511] group-hover:border-[#8bdc65] transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SOLAR FEATURE */}
      <section className="bg-[#f3f1e9] py-24 lg:py-36">
        <div className="max-w-[1550px] mx-auto px-5 sm:px-8 lg:px-14">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16 items-stretch">
            <Reveal>
              <div className="relative min-h-[500px] lg:min-h-[720px] overflow-hidden bg-[#d8d7ce]">
               <img
  src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1800&h=2000&fit=crop&auto=format"
  alt="Solar panels installed for residential power in Nigeria"
  className="absolute inset-0 w-full h-full object-cover"
/>

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                <div className="absolute left-6 bottom-6 lg:left-10 lg:bottom-10">
                  <div className="bg-[#f3f1e9] text-[#101511] px-5 py-4">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-black/45">
                      Energy independence
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      Designed for real life.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="flex flex-col justify-between py-2 lg:py-8">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.22em] text-[#15803D]">
                    Why solar
                  </span>

                  <h2 className="mt-6 text-[clamp(3rem,5vw,5.5rem)] leading-[0.9] tracking-[-0.055em] font-medium">
                    Own more
                    <br />
                    of your
                    <br />
                    power.
                  </h2>

                  <p className="mt-8 text-sm lg:text-base leading-7 text-black/55 max-w-md">
                    Solar isn't simply about replacing your generator. It's
                    about creating a better energy setup for the things that
                    matter to you.
                  </p>
                </div>

                <div className="mt-14">
                  {benefits.map((benefit) => (
                    <div
                      key={benefit.number}
                      className="border-t border-black/12 py-5 grid grid-cols-[45px_1fr] gap-5"
                    >
                      <span className="text-xs text-[#15803D]">
                        {benefit.number}
                      </span>

                      <div>
                        <h4 className="text-sm font-semibold">
                          {benefit.title}
                        </h4>

                        <p className="mt-1 text-xs leading-6 text-black/45 max-w-md">
                          {benefit.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => nav("solar")}
                  className="mt-8 self-start flex items-center gap-4 text-sm font-semibold group"
                >
                  Explore solar solutions

                  <span className="w-10 h-10 rounded-full bg-[#15803D] text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* LATEST PRODUCTS */}
      <section className="bg-[#f3f1e9] py-20 lg:py-28 border-t border-black/5">
        <div className="max-w-[1550px] mx-auto px-5 sm:px-8 lg:px-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">
            <div>
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#15803D]">
                Available now
              </span>

              <h2 className="mt-4 text-4xl sm:text-5xl lg:text-7xl tracking-[-0.06em] font-medium">
                Latest products.
              </h2>

              <p className="mt-3 text-sm text-black/55">
                Explore our latest energy products and equipment.
              </p>
            </div>

            <button
              onClick={() => nav("store")}
              className="flex items-center gap-3 text-sm font-semibold group self-start sm:self-auto"
            >
              View all products

              <span className="w-10 h-10 rounded-full bg-[#15803D] text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </div>

          {latestProducts.length === 0 ? (
            <p className="py-8 text-sm text-black/50">
              New products will appear here soon.
            </p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
              {latestProducts.map((product) => (
                <article
                  key={product.id}
                  className="bg-white border border-black/5 overflow-hidden"
                >
                  <button
                    onClick={() => nav("store")}
                    aria-label={`View ${product.name} in the store`}
                    className="block w-full aspect-square bg-[#e9e8e1] overflow-hidden"
                  >
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-black/30">
                        <span className="text-xs">Product image</span>
                      </div>
                    )}
                  </button>

                  <div className="p-3 sm:p-5">
                    <h3 className="text-sm sm:text-base font-semibold text-[#101511] line-clamp-2">
                      {product.name}
                    </h3>

                    <p className="mt-2 text-sm sm:text-base font-bold text-[#15803D]">
                      ₦{Number(product.price).toLocaleString("en-NG")}
                    </p>

                    <a
                      href={`https://wa.me/2348109946212?text=${encodeURIComponent(
                        `Hello Gabito Energy, I'm interested in ${product.name}, priced at ₦${Number(product.price).toLocaleString("en-NG")}.`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center mt-3 bg-[#15803D] text-white py-2.5 px-2 text-xs sm:text-sm font-semibold hover:bg-[#166534] transition-colors"
                    >
                      Buy Now
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* STATS */}
      <section ref={statsRef} className="bg-[#8bdc65] text-[#101511]">
        <div className="max-w-[1550px] mx-auto px-3 sm:px-8 lg:px-14">
          <div className="grid grid-cols-4">
            {[
              {
                value: `${installs}+`,
                label: "Installations completed",
              },
              {
                value: `${customers}+`,
                label: "Customers served",
              },
              {
                value: "24/7",
                label: "Technical support",
              },
              {
                value: "Nigeria",
                label: "Nationwide coverage",
              },
            ].map((stat, index) => (
              <Reveal key={stat.label} delay={index * 0.05}>
                <div
                  className={`py-4 px-2 sm:py-6 sm:px-4 lg:py-8 lg:pr-12 ${
                    index !== 3 ? "border-r border-black/15" : ""
                  }`}
                >
                  <div className="text-[clamp(0.85rem,3.8vw,4.5rem)] sm:text-[clamp(1.5rem,4vw,4.5rem)] tracking-[-0.06em] leading-none font-medium break-words">
                    {stat.value}
                  </div>

                  <p className="mt-2 text-[6px] sm:text-[9px] uppercase tracking-normal sm:tracking-[0.16em] font-semibold leading-3 sm:leading-5">
                    {stat.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="bg-[#101511] text-white py-24 lg:py-32">
        <div className="max-w-[1550px] mx-auto px-5 sm:px-8 lg:px-14">
          <Reveal>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
              <div>
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#8bdc65]">
                  Recent work
                </span>

                <h2 className="mt-5 text-[clamp(3rem,6vw,6.5rem)] leading-[0.84] tracking-[-0.06em] font-medium">
                  Installed.
                  <br />
                  Tested.
                  <br />
                  Working.
                </h2>
              </div>

              <button
                onClick={() => nav("projects")}
                className="group flex items-center gap-3 text-sm font-semibold"
              >
                See all projects

                <span className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-[#8bdc65] group-hover:text-[#101511] group-hover:border-[#8bdc65] transition-all">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
            {projects.map((project, index) => (
              <Reveal key={project.title} delay={index * 0.06}>
                <button
                  onClick={() => nav("projects")}
                  className="group text-left w-full"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#1c221e]">
                    <ImageWithFallback
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

                    <div className="absolute left-5 right-5 bottom-5">
                      <p className="text-[9px] uppercase tracking-[0.14em] text-white/55 mb-2">
                        {project.category}
                      </p>

                      <h3 className="text-lg font-medium">{project.title}</h3>

                      <p className="mt-1 text-xs text-white/55 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" />
                        {project.location}
                      </p>
                    </div>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="bg-[#f3f1e9] py-24 lg:py-32">
        <div className="max-w-[1550px] mx-auto px-5 sm:px-8 lg:px-14">
          <div className="grid lg:grid-cols-[0.75fr_1.25fr] gap-14 lg:gap-24">
            <Reveal>
              <div>
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#15803D]">
                  Why Gabito
                </span>

                <h2 className="mt-6 text-[clamp(3rem,5vw,5.5rem)] leading-[0.9] tracking-[-0.055em] font-medium">
                  We don't
                  <br />
                  sell what
                  <br />
                  you don't need.
                </h2>

                <p className="mt-7 text-sm leading-7 text-black/50 max-w-md">
                  Good solar work begins with honest assessment. We recommend
                  systems around your requirements, budget and future needs.
                </p>
              </div>
            </Reveal>

            <div className="border-t border-black/12">
              {[
                {
                  title: "Experienced technicians",
                  desc: "Our installers are trained and have completed successful projects across Anambra and beyond.",
                },
                {
                  title: "Quality components",
                  desc: "We work with established equipment brands rather than cutting corners with substandard hardware.",
                },
                {
                  title: "Proper system sizing",
                  desc: "We calculate your requirements before recommending the system you need.",
                },
                {
                  title: "Professional installation",
                  desc: "Every installation is properly wired, tested and commissioned before handover.",
                },
                {
                  title: "After-sales support",
                  desc: "We remain available when your system needs servicing, troubleshooting or maintenance.",
                },
                {
                  title: "Local knowledge",
                  desc: "Based in Nnewi, we understand the practical realities of power supply in Nigeria.",
                },
              ].map((item, index) => (
                <Reveal key={item.title} delay={index * 0.04}>
                  <div className="py-7 border-b border-black/12 grid grid-cols-1 sm:grid-cols-[50px_0.8fr_1.2fr] gap-4 sm:gap-8">
                    <span className="text-xs text-[#15803D]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <h3 className="font-medium text-base">{item.title}</h3>

                    <p className="text-xs sm:text-sm leading-6 text-black/45">
                      {item.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-24 lg:py-32">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-[0.65fr_1.35fr] gap-12 lg:gap-20">
            <Reveal>
              <div>
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#15803D]">
                  Questions
                </span>

                <h2 className="mt-6 text-[clamp(3rem,5vw,5rem)] leading-[0.9] tracking-[-0.055em] font-medium">
                  Let's clear
                  <br />
                  things up.
                </h2>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="border-t border-black/12">
                {homeFaqs.map((faq, index) => (
                  <FAQItem
                    key={index}
                    q={faq.q}
                    a={faq.a}
                    delay={index * 0.05}
                  />
                ))}

                <button
                  onClick={() => nav("faq")}
                  className="mt-7 flex items-center gap-3 text-sm font-semibold text-[#15803D] group"
                >
                  View all questions
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#191e1a] text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[48%]">
          <img
            src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1800&h=1300&fit=crop&auto=format"
            alt=""
            className="w-full h-full object-cover opacity-45"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#191e1a] via-[#191e1a]/65 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1550px] mx-auto px-5 sm:px-8 lg:px-14 py-28 lg:py-40">
          <Reveal>
            <div className="max-w-4xl">
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#8bdc65]">
                Your next step
              </span>

              <h2 className="mt-6 text-[clamp(3.5rem,7vw,8rem)] leading-[0.82] tracking-[-0.07em] font-medium">
                Let's build
                <br />
                your power
                <br />
                system.
              </h2>

              <p className="mt-8 text-sm sm:text-base leading-7 text-white/45 max-w-lg">
                Tell us what you need and we'll help you determine the right
                solution for your home or business.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mt-10">
                <button
                  onClick={() => nav("quote")}
                  className="flex items-center justify-center gap-3 bg-[#8bdc65] text-[#101511] font-semibold px-7 py-4 hover:bg-[#a0e87e] transition-colors"
                >
                  Get a free assessment
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={`tel:${PHONE1}`}
                  className="flex items-center justify-center gap-3 border border-white/20 px-7 py-4 text-sm font-medium hover:border-white/45 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call Gabito
                </a>

                <a
                  href={wa()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 border border-[#25D366]/30 text-[#25D366] px-7 py-4 text-sm font-medium hover:bg-[#25D366]/10 transition-colors"
                >
                  <img
                    src={whatsappIcon}
                    alt="WhatsApp"
                    className="w-5 h-5 object-contain"
                  />
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
// ── PROJECTS PAGE ────────────────────────────────────────────────────────────

function ProjectsPage({ nav }: { nav: (p: Page) => void }) {
  const [tab, setTab] = useState<
    "all" | "residential" | "commercial"
  >("all");

  const [all, setAll] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjectsFromSupabase();
        setAll(data);
      } catch (error) {
        console.error(
          "Failed to load public projects:",
          error,
        );
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const filtered =
    tab === "all"
      ? all
      : all.filter((p) => p.category === tab);

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

            {(
              ["all", "residential", "commercial"] as const
            ).map((t) => (
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
                  : `${t} (${all.filter(
                      (p) => p.category === t,
                    ).length})`}
              </button>
            ))}

          </div>

          {loading ? (
            <div className="py-20 text-center text-sm text-gray-400">
              Loading projects...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {filtered.map((p, i) => (
                <Reveal
                  key={p.title}
                  delay={i * 0.06}
                >

                  <div className="group rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300">

                    <div className="relative h-60 bg-gray-100 overflow-hidden">

                      <ImageWithFallback
                        src={p.thumbnail}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      <span
                        className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full ${
                          p.category === "residential"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {p.category === "residential"
                          ? "Residential"
                          : "Commercial"}
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
          )}

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
            From small home backup systems to large commercial installations,
            we design and install solutions that actually work in Nigeria's
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
              <Reveal
                key={s.title}
                delay={i * 0.08}
              >

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
                  <Reveal
                    key={s.n}
                    delay={i * 0.1}
                  >

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
              <img
                src={whatsappIcon}
                alt="WhatsApp"
                className="w-8 h-6"
              />
              Chat on WhatsApp
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
              <Reveal
                key={item.title}
                delay={i * 0.08}
              >

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
              <img
                src={whatsappIcon}
                alt="WhatsApp"
                className="w-8 h-6"
              />
              Chat on WhatsApp
            </a>

          </div>

        </div>
      </section>

    </div>
  );
}

// ── ABOUT PAGE ───────────────────────────────────────────────────────────────

function AboutPage() {
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
              <Reveal
                key={item.t}
                delay={i * 0.1}
              >

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

                  <div className="text-gray-600 text-sm font-medium">
                    {s.l}
                  </div>

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

              <p className="text-gray-400 text-sm mb-6">
                {ADDRESS}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">

                <a
                  href={`tel:${PHONE1}`}
                  className="flex items-center justify-center gap-2 bg-[#15803D] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#166534] transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {PHONE1}
                </a>

                <a
                  href={wa()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-white/8 border border-white/15 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/14 transition-colors"
                >
                  <img
                    src={whatsappIcon}
                    alt="WhatsApp"
                    className="w-8 h-6"
                  />
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
              <FAQItem
                key={i}
                q={f.q}
                a={f.a}
              />
            ))}

          </div>

        </div>
      </section>

    </div>
  );
}

// ── CONTACT PAGE ─────────────────────────────────────────────────────────────

function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: "",
  });

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
                  <div
                    key={item.label}
                    className="flex gap-4"
                  >

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

                  <p className="font-bold text-gray-900 mb-2">
                    Message Sent!
                  </p>

                  <p className="text-gray-500 text-sm">
                    We'll respond on WhatsApp shortly.
                  </p>

                </div>
              ) : (
                <form
                  onSubmit={submit}
                  className="space-y-4"
                >

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Full Name
                    </label>

                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          name: e.target.value,
                        })
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
                        setForm({
                          ...form,
                          phone: e.target.value,
                        })
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
                        setForm({
                          ...form,
                          message: e.target.value,
                        })
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
      setForm((f) => ({
        ...f,
        [k]: e.target.value,
      }));

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
                {
                  k: "name",
                  l: "Full Name",
                  t: "text",
                  ph: "Your full name",
                },
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

                  <option value="">
                    Select property type
                  </option>

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

                  <option value="">
                    Select service
                  </option>

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

                  <option value="">
                    Select your main challenge
                  </option>

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
                  <span className="font-normal text-gray-400">
                    (optional)
                  </span>
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

type SiteSettings = {
  businessPhone: string;
  whatsapp: string;
  email: string;
  address: string;
  hours: string;
  googleMaps: string;
  facebook: string;
  instagram: string;
  linkedin: string;
};

function Footer({ nav }: { nav: (p: Page) => void }) {
  const [settings, setSettings] =
    useState<SiteSettings | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error(
          "Failed to load footer settings:",
          error,
        );
        return;
      }

      if (data) {
        setSettings({
          businessPhone: data.business_phone || "",
          whatsapp: data.whatsapp || "",
          email: data.email || "",
          address: data.address || "",
          hours: data.hours || "",
          googleMaps: data.google_maps || "",
          facebook: data.facebook || "",
          instagram: data.instagram || "",
          linkedin: data.linkedin || "",
        });
      }
    };

    loadSettings();
  }, []);

  const address =
    settings?.address || ADDRESS;

  const phone =
    settings?.businessPhone || PHONE1;

  const whatsapp =
    settings?.whatsapp || "";

  const whatsappLink = whatsapp
    ? `https://wa.me/${whatsapp.replace(/\D/g, "")}`
    : wa();

  return (
    <footer className="bg-[#0D1117]">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-white/[0.07]">

          {/* BRAND */}

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
              Smarter Energy Solutions. Solar systems, inverters, batteries,
              and CCTV for homes and businesses across Nigeria.
            </p>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366]/15 text-[#25D366] text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-[#25D366]/25 transition-colors"
            >

              <img
                src={whatsappIcon}
                alt="WhatsApp"
                className="w-8 h-6"
              />

              Chat on WhatsApp

            </a>

          </div>

          {/* SERVICES */}

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

          {/* COMPANY */}

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

          {/* CONTACT */}

          <div>

            <h4 className="text-white font-semibold text-[13px] mb-4">
              Contact
            </h4>

            <div className="space-y-3">

              <div className="flex gap-2.5">

                <MapPin className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />

                <p className="text-gray-500 text-[13px] leading-relaxed">
                  {address}
                </p>

              </div>

              <div className="flex gap-2.5">

                <Phone className="w-4 h-4 text-[#15803D] shrink-0" />

                <div>

                  {phone && (
                    <a
                      href={`tel:${phone}`}
                      className="text-gray-500 hover:text-white text-[13px] block transition-colors"
                    >
                      {phone}
                    </a>
                  )}

                </div>

              </div>

            </div>

          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-[12px] text-gray-600">
  <p>
    © {new Date().getFullYear()} Gabito Energy Solution. All rights
    reserved.
  </p>

  <div className="flex items-center gap-4">
    <p>{address || "Nigeria"} · Nationwide Delivery</p>

    <button
  onClick={() => {
    sessionStorage.removeItem("gabito_admin");
    window.location.hash = "admin";
  }}
  className="text-gray-600 hover:text-gray-400 transition-colors text-[11px]"
  title="Admin Dashboard"
>
  Admin
</button>
  </div>
</div>

      </div>

    </footer>
  );
}



type StoreProduct = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  published: boolean;
  updated_at: string;
};

function StorePage() {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("published", true)
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Failed to load store products:", error);
      } else {
        setProducts((data ?? []) as StoreProduct[]);
      }

      setLoading(false);
    }

    void loadProducts();
  }, []);

  return (
    <section className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <p className="text-sm font-semibold text-[#15803D] uppercase tracking-wider">
            Gabito Energy Solution
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
            Our Store
          </h1>
          <p className="text-gray-600 mt-2">
            Explore our available energy products.
          </p>
        </div>

        {loading ? (
          <p className="text-gray-500 py-10">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500 py-10">
            No products are available at the moment. Please check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <article
                key={product.id}
                className="border border-gray-200 rounded-xl overflow-hidden bg-white"
              >
                <div className="aspect-square bg-gray-100">
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="p-3 sm:p-4">
                  <h2 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2">
                    {product.name}
                  </h2>

                  <p className="text-[#15803D] font-bold mt-2">
                    ₦{Number(product.price).toLocaleString("en-NG")}
                  </p>

                  <a
                    href={`https://wa.me/2348109946212?text=${encodeURIComponent(
                      `Hello Gabito Energy, I'm interested in ${product.name}, priced at ₦${Number(product.price).toLocaleString("en-NG")}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center bg-[#15803D] hover:bg-[#166534] text-white rounded-lg py-2.5 px-2 mt-3 text-sm font-semibold"
                  >
                    Buy Now
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [isAdmin, setIsAdmin] = useState(() =>
    window.location.hash.startsWith("#admin"),
  );

  const [page, setPage] = useState<Page>("home");

  useEffect(() => {
    const fn = () =>
      setIsAdmin(
        window.location.hash.startsWith("#admin"),
      );

    window.addEventListener("hashchange", fn);

    return () =>
      window.removeEventListener("hashchange", fn);
  }, []);

  const nav = (p: Page) => {
    setPage(p);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (isAdmin) {
    return <AdminApp />;
  }

  return (
    <div className="min-h-screen">

      <Header
        page={page}
        nav={nav}
      />

      <main>

        {page === "home" && (
          <HomePage nav={nav} />
        )}

        {page === "solar" && (
          <SolarPage nav={nav} />
        )}

        {page === "cctv" && (
          <CCTVPage nav={nav} />
        )}

        {page === "projects" && (
          <ProjectsPage nav={nav} />
        )}

        {page === "store" && <StorePage />}

        {page === "about" && (
          <AboutPage />
        )}

        {page === "faq" && (
          <FAQPage />
        )}

        {page === "contact" && (
          <ContactPage />
        )}

        {page === "quote" && (
          <QuotePage />
        )}

      </main>

      <Footer nav={nav} />

      <WAFab />

    </div>
  );
}

