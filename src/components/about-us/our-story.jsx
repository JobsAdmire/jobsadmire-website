import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  MapPin,
  Globe,
  Clock,
  Plane,
  GraduationCap,
  Users,
  ArrowRight,
  TrendingUp,
  Star,
  Award,
  Shield,
  Zap,
} from "lucide-react";

// Import translation files for all 7 languages
import enTranslations from "../../../public/locales/en/premiummigrationmap.json";
import trTranslations from "../../../public/locales/tr/premiummigrationmap.json";
import frTranslations from "../../../public/locales/fr/premiummigrationmap.json";
import deTranslations from "../../../public/locales/de/premiummigrationmap.json";
import arTranslations from "../../../public/locales/ar/premiummigrationmap.json";
import ruTranslations from "../../../public/locales/ru/premiummigrationmap.json";
import faTranslations from "../../../public/locales/fa/premiummigrationmap.json";

const PremiumMigrationMap = () => {
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [animationPhase, setAnimationPhase] = useState(0);
  const router = useRouter();
  const { locale } = router;

  // Get translations based on current locale
  const getTranslations = () => {
    switch (locale) {
      case "tr":
        return trTranslations;
      case "fr":
        return frTranslations;
      case "de":
        return deTranslations;
      case "ar":
        return arTranslations;
      case "ru":
        return ruTranslations;
      case "fa":
        return faTranslations;
      default:
        return enTranslations;
    }
  };

  const t = getTranslations();

  // Advanced animation cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Floating Elements Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute rounded-full top-20 left-10 w-72 h-72 bg-blue-400/5 blur-3xl animate-pulse"></div>
        <div
          className="absolute rounded-full top-40 right-20 w-96 h-96 bg-purple-400/5 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute rounded-full bottom-20 left-1/4 w-80 h-80 bg-emerald-400/5 blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Premium Header */}
      <div className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          {/* Premium Badge */}

          {/* Main Title */}

          <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-500 to-sky-500">
              {t.header.title}
            </span>
          </h2>
          <p className="mb-4 text-2xl font-bold text-transparent bg-gradient-to-r from-sky-600 to-sky-600 bg-clip-text md:text-3xl">
            {t.header.subtitle}
          </p>

          <p className="max-w-3xl mx-auto text-lg leading-relaxed text-gray-600">
            {t.header.description}
          </p>
        </div>
      </div>

      {/* Turkey Map Section */}
      <div className="relative px-6 pb-20">
        <div className="mx-auto max-w-7xl">
          {/* Map Container */}
          <div className="relative overflow-hidden border shadow-2xl bg-white/60 backdrop-blur-xl rounded-3xl border-gray-200/50">
            <div
              className="relative h-[700px] bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50"
              style={{
                backgroundImage: "url(/images/tmap.jpg)", // Replace with your Turkey map image path
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
              onMouseEnter={() => setHoveredRegion("turkey")}
              onMouseLeave={() => setHoveredRegion(null)}
            >
              {/* Overlay gradient for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30"></div>

              {/* Title Overlay */}

              {/* Major Cities Markers as HTML elements */}
              <div className="absolute inset-0">
                {/* Istanbul */}

                {/* Ankara */}

                {/* Bursa */}
              </div>

              {/* Decorative floating elements */}
              <div className="absolute w-12 h-12 rounded-full top-20 right-10 bg-blue-400/10 animate-pulse blur-sm"></div>
              <div
                className="absolute w-8 h-8 rounded-full bottom-20 left-16 bg-purple-400/10 animate-pulse blur-sm"
                style={{ animationDelay: "2s" }}
              ></div>
            </div>

            {/* Enhanced Legend */}

            {/* Floating Success Stories */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumMigrationMap;
