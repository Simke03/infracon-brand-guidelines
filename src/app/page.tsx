"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const NAV_ITEMS = [
  { id: "hero", label: "Cover" },
  { id: "logo", label: "Logo" },
  { id: "colors", label: "Boje" },
  { id: "typography", label: "Tipografija" },
  { id: "mockups", label: "Primjena" },
  { id: "footer", label: "Kontakt" },
];

const COLORS = [
  {
    name: "Navy",
    hex: "#1c2736",
    rgb: "28, 39, 54",
    usage: "Primarna pozadina, tamne sekcije, logo na svijetloj podlozi",
    bg: "bg-[#1c2736]",
    border: "border border-[#d4d0ca]/20",
  },
  {
    name: "Cream",
    hex: "#d4d0ca",
    rgb: "212, 208, 202",
    usage: "Logo na tamnoj podlozi, akcentni tekst, sekundarni elementi",
    bg: "bg-[#d4d0ca]",
    border: "",
  },
  {
    name: "White",
    hex: "#FFFFFF",
    rgb: "255, 255, 255",
    usage: "Pozadine, tekst na tamnim podlogama, čisti prostori",
    bg: "bg-white",
    border: "",
  },
  {
    name: "Black",
    hex: "#111111",
    rgb: "17, 17, 17",
    usage: "Tekst na svijetlim pozadinama, kontrastni elementi",
    bg: "bg-[#111111]",
    border: "border border-[#d4d0ca]/20",
  },
];


function LogoPlaceholder({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div className={`flex items-center justify-center border border-dashed border-[#d4d0ca]/30 rounded-lg p-8 min-h-[160px] ${className}`}>
      <span className="text-[#d4d0ca]/50 text-sm font-[family-name:var(--font-dm)] tracking-wider uppercase">
        {label}
      </span>
    </div>
  );
}

function LogoImage({ src, alt, className = "", invert = false }: { src: string; alt: string; className?: string; invert?: boolean }) {
  const [error, setError] = useState(false);
  if (error) {
    return <LogoPlaceholder label={alt} className={className} />;
  }
  return (
    <div className={`flex items-center justify-center p-4 sm:p-8 min-h-[120px] sm:min-h-[160px] ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={240}
        height={160}
        className={`max-h-[100px] sm:max-h-[140px] w-auto object-contain ${invert ? "brightness-0" : ""}`}
        style={invert ? { filter: "brightness(0) saturate(100%)" } : undefined}
        onError={() => setError(true)}
      />
    </div>
  );
}

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm cursor-zoom-out"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
      >
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={1000}
        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

function MockupImage({ src, alt, onOpen }: { src: string; alt: string; onOpen: (src: string, alt: string) => void }) {
  const [error, setError] = useState(false);
  if (error) return null;
  return (
    <div
      className="mockup-card overflow-hidden rounded-lg shadow-lg shadow-black/20 cursor-zoom-in"
      onClick={() => onOpen(src, alt)}
    >
      <Image
        src={src}
        alt={alt}
        width={600}
        height={400}
        className="w-full h-auto object-cover"
        onError={() => setError(true)}
      />
    </div>
  );
}

export default function BrandGuidelines() {
  const [activeSection, setActiveSection] = useState("hero");
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".fade-in").forEach((el) => fadeObserver.observe(el));

    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) {
        sectionRefs.current[id] = el;
        navObserver.observe(el);
      }
    });

    return () => {
      fadeObserver.disconnect();
      navObserver.disconnect();
    };
  }, []);

  // logo1.svg = icon/mark only
  // logo2.svg = icon + "INFRACON" name
  // logo3.svg = full lockup (icon + "INFRACON" text below)
  const logoFiles = {
    mark: "/logos/logo1.svg",
    name: "/logos/logo2.svg",
    full: "/logos/logo3.svg",
  };


  const openLightbox = (src: string, alt: string) => setLightbox({ src, alt });

  return (
    <>
      {lightbox && (
        <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
      )}

      {/* Sticky Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1c2736]/90 backdrop-blur-md border-b border-[#d4d0ca]/10">
        <div className="max-w-7xl mx-auto px-6 flex items-center h-14 gap-8">
          <span className="font-[family-name:var(--font-orbitron)] text-sm font-bold tracking-[0.15em] text-[#d4d0ca] shrink-0">
            INFRACON
          </span>
          {/* Desktop nav */}
          <div className="hidden md:flex gap-1 ml-auto">
            {NAV_ITEMS.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className={`nav-link px-3 py-1.5 text-xs tracking-[0.1em] uppercase border-b-2 border-transparent transition-all font-[family-name:var(--font-dm)] font-medium ${
                  activeSection === id
                    ? "active text-[#d4d0ca] border-[#d4d0ca]"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                {label}
              </a>
            ))}
          </div>
          {/* Burger button */}
          <button
            className="md:hidden ml-auto flex flex-col justify-center items-center w-8 h-8 gap-[5px] group"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-[2px] bg-[#d4d0ca] transition-all duration-300 ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`block w-5 h-[2px] bg-[#d4d0ca] transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-[2px] bg-[#d4d0ca] transition-all duration-300 ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[#1c2736]/95 backdrop-blur-lg transition-all duration-300 md:hidden flex flex-col items-center justify-center gap-6 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {NAV_ITEMS.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={() => setMenuOpen(false)}
            className={`text-lg tracking-[0.2em] uppercase font-[family-name:var(--font-dm)] font-medium transition-colors ${
              activeSection === id
                ? "text-[#d4d0ca]"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            {label}
          </a>
        ))}
      </div>

      <main className="snap-container">
        {/* HERO */}
        <section
          id="hero"
          className="snap-section min-h-screen flex flex-col items-center justify-center relative px-6"
        >
          <div className="text-center">
            <div className="mb-10">
              <LogoImage
                src={logoFiles.mark}
                alt="Logo Mark"
                className="bg-transparent"
              />
            </div>

            <h1 className="font-[family-name:var(--font-orbitron)] text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-[0.12em] sm:tracking-[0.2em] text-white mb-6">
              INFRACON
            </h1>
            <p className="font-[family-name:var(--font-dm)] text-xs sm:text-base md:text-lg tracking-[0.15em] sm:tracking-[0.3em] uppercase text-[#d4d0ca]/70 mb-2">
              Infrastructure &amp; Construction
            </p>
            <div className="w-16 h-px bg-[#d4d0ca]/30 mx-auto my-8" />
            <p className="font-[family-name:var(--font-dm)] text-sm tracking-[0.2em] uppercase text-white/40">
              Brand Guidelines 2026
            </p>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/30 font-[family-name:var(--font-dm)]">
              Scroll
            </span>
            <div className="w-px h-8 bg-white/20" />
          </div>
        </section>

        {/* LOGO */}
        <section id="logo" className="snap-section min-h-screen py-16 sm:py-28 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="fade-in mb-10 sm:mb-20">
              <p className="text-xs tracking-[0.3em] uppercase text-[#d4d0ca]/50 font-[family-name:var(--font-dm)] mb-3">
                01
              </p>
              <h2 className="font-[family-name:var(--font-orbitron)] text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.15em] uppercase text-white">
                Logo
              </h2>
              <div className="w-12 h-px bg-[#d4d0ca]/30 mt-6" />
            </div>

            <div className="fade-in grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-[#d4d0ca]/60 mb-4 font-[family-name:var(--font-dm)]">
                  Full Lockup
                </p>
                <p className="text-[11px] text-white/40 mb-4 font-[family-name:var(--font-dm)]">
                  Ikona + naziv + tagline
                </p>
                <div className="space-y-3">
                  <LogoImage src={logoFiles.full} alt="Full Lockup — na svijetloj" className="bg-white rounded-lg" invert />
                  <LogoImage src={logoFiles.full} alt="Full Lockup — na tamnoj" className="bg-[#1c2736] rounded-lg border border-[#d4d0ca]/10" />
                </div>
              </div>
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-[#d4d0ca]/60 mb-4 font-[family-name:var(--font-dm)]">
                  Logo Mark
                </p>
                <p className="text-[11px] text-white/40 mb-4 font-[family-name:var(--font-dm)]">
                  Samo ikona — favicon, mali prostori
                </p>
                <div className="space-y-3">
                  <LogoImage src={logoFiles.mark} alt="Logo Mark — na svijetloj" className="bg-white rounded-lg" invert />
                  <LogoImage src={logoFiles.mark} alt="Logo Mark — na tamnoj" className="bg-[#1c2736] rounded-lg border border-[#d4d0ca]/10" />
                </div>
              </div>
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-[#d4d0ca]/60 mb-4 font-[family-name:var(--font-dm)]">
                  Logo + Naziv
                </p>
                <p className="text-[11px] text-white/40 mb-4 font-[family-name:var(--font-dm)]">
                  Ikona + &quot;INFRACON&quot;
                </p>
                <div className="space-y-3">
                  <LogoImage src={logoFiles.name} alt="Logo + Name — na svijetloj" className="bg-white rounded-lg" invert />
                  <LogoImage src={logoFiles.name} alt="Logo + Name — na tamnoj" className="bg-[#1c2736] rounded-lg border border-[#d4d0ca]/10" />
                </div>
              </div>
            </div>

            <div className="fade-in grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 mt-10 sm:mt-16">
              <div className="border border-[#d4d0ca]/10 rounded-lg p-5 sm:p-8">
                <h3 className="font-[family-name:var(--font-dm)] text-sm font-medium tracking-[0.15em] uppercase text-[#d4d0ca] mb-4">
                  Zaštitni prostor
                </h3>
                <p className="text-sm text-white/60 font-[family-name:var(--font-dm)] leading-relaxed">
                  Minimalan zaštitni prostor oko loga jednak je visini krovnog/strelica elementa u ikoni. Ovaj prostor mora ostati slobodan od drugih grafičkih elemenata ili teksta.
                </p>
              </div>
              <div className="border border-[#d4d0ca]/10 rounded-lg p-5 sm:p-8">
                <h3 className="font-[family-name:var(--font-dm)] text-sm font-medium tracking-[0.15em] uppercase text-[#d4d0ca] mb-4">
                  Minimalna veličina
                </h3>
                <div className="space-y-3 text-sm text-white/60 font-[family-name:var(--font-dm)]">
                  <div className="flex justify-between items-center border-b border-[#d4d0ca]/5 pb-2">
                    <span>Samo ikona</span>
                    <span className="text-white/80 font-medium">24px</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-[#d4d0ca]/5 pb-2">
                    <span>Ikona + naziv</span>
                    <span className="text-white/80 font-medium">80px</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Full lockup</span>
                    <span className="text-white/80 font-medium">120px</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* COLOR PALETTE */}
        <section id="colors" className="snap-section py-16 sm:py-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="fade-in mb-10 sm:mb-20">
              <p className="text-xs tracking-[0.3em] uppercase text-[#d4d0ca]/50 font-[family-name:var(--font-dm)] mb-3">
                03
              </p>
              <h2 className="font-[family-name:var(--font-orbitron)] text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.15em] uppercase text-white">
                Boje
              </h2>
              <div className="w-12 h-px bg-[#d4d0ca]/30 mt-6" />
            </div>

            <div className="fade-in grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {COLORS.map((color) => (
                <div key={color.name}>
                  <div
                    className={`${color.bg} ${color.border} rounded-lg h-28 sm:h-44 mb-4`}
                  />
                  <h3 className="font-[family-name:var(--font-dm)] text-lg font-bold text-white mb-2">
                    {color.name}
                  </h3>
                  <div className="space-y-1.5 font-[family-name:var(--font-dm)]">
                    <p className="text-xs text-white/60">
                      <span className="text-[#d4d0ca]/80 font-medium">HEX</span>{" "}
                      {color.hex}
                    </p>
                    <p className="text-xs text-white/60">
                      <span className="text-[#d4d0ca]/80 font-medium">RGB</span>{" "}
                      {color.rgb}
                    </p>
                    <p className="text-[11px] text-white/40 leading-relaxed mt-3">
                      {color.usage}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TYPOGRAPHY */}
        <section id="typography" className="snap-section min-h-screen py-16 sm:py-28 px-4 sm:px-6 bg-[#151e2b]">
          <div className="max-w-6xl mx-auto">
            <div className="fade-in mb-10 sm:mb-20">
              <p className="text-xs tracking-[0.3em] uppercase text-[#d4d0ca]/50 font-[family-name:var(--font-dm)] mb-3">
                04
              </p>
              <h2 className="font-[family-name:var(--font-orbitron)] text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.15em] uppercase text-white">
                Tipografija
              </h2>
              <div className="w-12 h-px bg-[#d4d0ca]/30 mt-6" />
            </div>

            {/* Orbitron */}
            <div className="fade-in mb-12 sm:mb-20">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 mb-6">
                <h3 className="font-[family-name:var(--font-orbitron)] text-lg font-bold tracking-[0.1em] text-[#d4d0ca]">
                  Orbitron 700
                </h3>
                <span className="text-xs text-white/30 font-[family-name:var(--font-dm)] tracking-wider">
                  Display / Logo font
                </span>
              </div>

              <div className="border border-[#d4d0ca]/10 rounded-lg p-4 sm:p-8 mb-6">
                <p className="font-[family-name:var(--font-orbitron)] text-base sm:text-2xl md:text-3xl font-bold tracking-[0.08em] sm:tracking-[0.15em] text-white/80 leading-relaxed break-all">
                  A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
                </p>
              </div>

              <div className="border border-[#d4d0ca]/10 rounded-lg p-4 sm:p-8 space-y-4">
                <p className="font-[family-name:var(--font-orbitron)] text-2xl sm:text-5xl md:text-6xl font-bold tracking-[0.1em] sm:tracking-[0.2em] text-white">
                  INFRACON
                </p>
                <p className="font-[family-name:var(--font-orbitron)] text-xl sm:text-3xl md:text-4xl font-bold tracking-[0.1em] sm:tracking-[0.15em] text-white/70">
                  INFRACON
                </p>
                <p className="font-[family-name:var(--font-orbitron)] text-base sm:text-xl font-bold tracking-[0.1em] text-white/50">
                  INFRACON
                </p>
                <p className="font-[family-name:var(--font-orbitron)] text-sm font-bold tracking-[0.1em] text-white/30">
                  INFRACON
                </p>
              </div>
            </div>

            {/* DM Sans */}
            <div className="fade-in mb-12 sm:mb-20">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 mb-6">
                <h3 className="font-[family-name:var(--font-dm)] text-lg font-bold tracking-[0.05em] text-[#d4d0ca]">
                  DM Sans
                </h3>
                <span className="text-xs text-white/30 font-[family-name:var(--font-dm)] tracking-wider">
                  Body / UI font — 400, 500, 700
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="border border-[#d4d0ca]/10 rounded-lg p-5 sm:p-8">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#d4d0ca]/50 mb-4">Regular 400</p>
                  <p className="font-[family-name:var(--font-dm)] text-sm sm:text-base font-normal text-white/70 leading-relaxed">
                    Infrastruktura i građevinarstvo zahtijevaju preciznost, kvalitetu i posvećenost izvrsnosti u svakom detalju projekta.
                  </p>
                </div>
                <div className="border border-[#d4d0ca]/10 rounded-lg p-5 sm:p-8">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#d4d0ca]/50 mb-4">Medium 500</p>
                  <p className="font-[family-name:var(--font-dm)] text-sm sm:text-base font-medium text-white/70 leading-relaxed">
                    Infrastruktura i građevinarstvo zahtijevaju preciznost, kvalitetu i posvećenost izvrsnosti u svakom detalju projekta.
                  </p>
                </div>
                <div className="border border-[#d4d0ca]/10 rounded-lg p-5 sm:p-8">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#d4d0ca]/50 mb-4">Bold 700</p>
                  <p className="font-[family-name:var(--font-dm)] text-sm sm:text-base font-bold text-white/70 leading-relaxed">
                    Infrastruktura i građevinarstvo zahtijevaju preciznost, kvalitetu i posvećenost izvrsnosti u svakom detalju projekta.
                  </p>
                </div>
              </div>
            </div>

            {/* Font pairing */}
            <div className="fade-in mb-12 sm:mb-20">
              <h3 className="text-xs tracking-[0.2em] uppercase text-[#d4d0ca]/50 font-[family-name:var(--font-dm)] mb-6">
                Font Pairing
              </h3>
              <div className="border border-[#d4d0ca]/10 rounded-lg p-5 sm:p-10">
                <p className="font-[family-name:var(--font-orbitron)] text-xl sm:text-2xl md:text-3xl font-bold tracking-[0.08em] sm:tracking-[0.1em] text-white mb-4">
                  GRADIMO BUDUĆNOST
                </p>
                <p className="font-[family-name:var(--font-dm)] text-base text-white/60 leading-relaxed max-w-2xl">
                  INFRACON je vodeća građevinska kompanija specijalizirana za infrastrukturne projekte. S dugogodišnjim iskustvom i timom stručnjaka, pružamo kompletna rješenja od projektiranja do realizacije.
                </p>
              </div>
            </div>

            {/* Size hierarchy */}
            <div className="fade-in">
              <h3 className="text-xs tracking-[0.2em] uppercase text-[#d4d0ca]/50 font-[family-name:var(--font-dm)] mb-6">
                Hijerarhija veličina
              </h3>
              <div className="border border-[#d4d0ca]/10 rounded-lg p-5 sm:p-10 space-y-5 sm:space-y-6">
                <div className="flex items-baseline gap-3 sm:gap-6 border-b border-[#d4d0ca]/5 pb-4">
                  <span className="text-[10px] text-white/30 w-10 sm:w-12 shrink-0 font-[family-name:var(--font-dm)]">H1</span>
                  <p className="font-[family-name:var(--font-orbitron)] text-xl sm:text-4xl font-bold tracking-[0.08em] sm:tracking-[0.1em] text-white">
                    NASLOV SEKCIJE
                  </p>
                </div>
                <div className="flex items-baseline gap-3 sm:gap-6 border-b border-[#d4d0ca]/5 pb-4">
                  <span className="text-[10px] text-white/30 w-10 sm:w-12 shrink-0 font-[family-name:var(--font-dm)]">H2</span>
                  <p className="font-[family-name:var(--font-dm)] text-lg sm:text-2xl font-bold text-white/80">
                    Podnaslov sekcije
                  </p>
                </div>
                <div className="flex items-baseline gap-3 sm:gap-6 border-b border-[#d4d0ca]/5 pb-4">
                  <span className="text-[10px] text-white/30 w-10 sm:w-12 shrink-0 font-[family-name:var(--font-dm)]">H3</span>
                  <p className="font-[family-name:var(--font-dm)] text-base sm:text-lg font-medium text-white/70">
                    Naslov kartice ili komponente
                  </p>
                </div>
                <div className="flex items-baseline gap-3 sm:gap-6 border-b border-[#d4d0ca]/5 pb-4">
                  <span className="text-[10px] text-white/30 w-10 sm:w-12 shrink-0 font-[family-name:var(--font-dm)]">Body</span>
                  <p className="font-[family-name:var(--font-dm)] text-sm sm:text-base text-white/60">
                    Osnovni tekst korišten za opise, paragrafe i sadržaj stranice.
                  </p>
                </div>
                <div className="flex items-baseline gap-3 sm:gap-6">
                  <span className="text-[10px] text-white/30 w-10 sm:w-12 shrink-0 font-[family-name:var(--font-dm)]">Caption</span>
                  <p className="font-[family-name:var(--font-dm)] text-[11px] text-white/40">
                    Manje oznake, napomene i dodatne informacije
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MOCKUPS / APPLICATIONS */}
        <section id="mockups" className="snap-section min-h-screen py-16 sm:py-28 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="fade-in mb-10 sm:mb-20">
              <p className="text-xs tracking-[0.3em] uppercase text-[#d4d0ca]/50 font-[family-name:var(--font-dm)] mb-3">
                05
              </p>
              <h2 className="font-[family-name:var(--font-orbitron)] text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.1em] sm:tracking-[0.15em] uppercase text-white">
                Primjena
              </h2>
              <div className="w-12 h-px bg-[#d4d0ca]/30 mt-6" />
            </div>

            {/* Business cards */}
            <div className="fade-in mt-16">
              <h3 className="text-xs tracking-[0.2em] uppercase text-[#d4d0ca]/50 font-[family-name:var(--font-dm)] mb-6">
                Vizit karta / Business Card
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div
                    className="mockup-card overflow-hidden rounded-lg shadow-lg shadow-black/20 cursor-zoom-in"
                    onClick={() => openLightbox("/mockups/VIZITKA PREDNJA.jpg", "Vizit karta — Prednja strana")}
                  >
                    <Image
                      src="/mockups/VIZITKA PREDNJA.jpg"
                      alt="Vizit karta — Prednja strana"
                      width={800}
                      height={500}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <p className="text-[11px] tracking-[0.15em] uppercase text-[#d4d0ca]/40 font-[family-name:var(--font-dm)] mt-3 text-center">
                    Prednja strana / Front
                  </p>
                </div>
                <div>
                  <div
                    className="mockup-card overflow-hidden rounded-lg shadow-lg shadow-black/20 cursor-zoom-in"
                    onClick={() => openLightbox("/mockups/VIZITKA ZADNJA.jpg", "Vizit karta — Zadnja strana")}
                  >
                    <Image
                      src="/mockups/VIZITKA ZADNJA.jpg"
                      alt="Vizit karta — Zadnja strana"
                      width={800}
                      height={500}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <p className="text-[11px] tracking-[0.15em] uppercase text-[#d4d0ca]/40 font-[family-name:var(--font-dm)] mt-3 text-center">
                    Zadnja strana / Back
                  </p>
                </div>
              </div>
            </div>

            {/* Mockups grid */}
            <div className="fade-in mt-16">
              <h3 className="text-xs tracking-[0.2em] uppercase text-[#d4d0ca]/50 font-[family-name:var(--font-dm)] mb-6">
                Mockups
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { src: "/mockups/KACIGE.png", label: "Web stranica" },
                  { src: "/mockups/Construction_Banner_Mockup.jpg", label: "Građevinski banner" },
                  { src: "/mockups/Large_Banner_Mockup.jpg", label: "Veliki banner" },
                  { src: "/mockups/Large_Fence_Banner_Mockup.jpg", label: "Banner na ogradi" },
                  { src: "/mockups/Three_Banner_Flags_Mockup.jpg", label: "Zastave" },
                  { src: "/mockups/mockup.jpg", label: "Mockup" },
                ].map((item) => (
                  <div key={item.src}>
                    <div
                      className="mockup-card overflow-hidden rounded-lg shadow-lg shadow-black/20 cursor-zoom-in h-48 sm:h-60 lg:h-64"
                      onClick={() => openLightbox(item.src, item.label)}
                    >
                      <Image
                        src={item.src}
                        alt={item.label}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-[11px] tracking-[0.15em] uppercase text-[#d4d0ca]/40 font-[family-name:var(--font-dm)] mt-3 text-center">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <section id="footer" className="snap-section py-14 sm:py-20 px-4 sm:px-6 border-t border-[#d4d0ca]/10">
          <div className="max-w-6xl mx-auto text-center">
            <div className="fade-in">
              <p className="font-[family-name:var(--font-orbitron)] text-xl font-bold tracking-[0.2em] text-white mb-8">
                INFRACON
              </p>
              <div className="w-10 h-px bg-[#d4d0ca]/20 mx-auto mb-8" />
              <p className="text-xs tracking-[0.15em] uppercase text-white/40 font-[family-name:var(--font-dm)] mb-2">
                Designed by Dušan Simović
              </p>
              <p className="text-xs tracking-[0.1em] text-white/25 font-[family-name:var(--font-dm)]">
                2026 INFRACON. All rights reserved.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
