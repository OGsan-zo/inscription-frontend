"use client";

import Link from "next/link";
import { 
  BarChart3, Filter, Users, PlusCircle, ShieldCheck, 
  UserPlus, Download, BookOpen, ClipboardList, 
  Layers, Library, ChevronLeft, ChevronRight 
} from "lucide-react";
import { User } from "@/lib/db";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useRef, useState, useEffect, useCallback } from "react";

interface MenuProps {
  user: User | null;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

interface TabItem {
  key: string;
  label: string;
  icon: React.ReactNode;
}

export default function Menu({ user }: MenuProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLAnchorElement>(null);
  
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Vérifie si on peut scroller pour afficher/masquer les flèches et dégradés
  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  }, []);

  // Centre l'onglet actif automatiquement dans la vue
  const scrollToActiveTab = useCallback(() => {
    if (activeTabRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const tab = activeTabRef.current;
      const scrollLeft = tab.offsetLeft - (container.clientWidth / 2) + (tab.clientWidth / 2);
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    
    updateScrollState();
    const timer = setTimeout(scrollToActiveTab, 150);

    el.addEventListener("scroll", updateScrollState);
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
      clearTimeout(timer);
    };
  }, [updateScrollState, scrollToActiveTab, pathname, searchParams]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -250 : 250, behavior: "smooth" });
  };

  // --- Construction de la liste des onglets selon le rôle ---
  const tabs: TabItem[] = [];

  if (user?.role === "Utilisateur") {
    tabs.push(
      { key: "/utilisateur/dashboard", label: "Dashboard", icon: <BarChart3 size={18} /> },
      { key: "/utilisateur/inscription", label: "Réinscription", icon: <Users size={18} /> },
      { key: "/utilisateur/filtrage", label: "Filtrage", icon: <Filter size={18} /> },
      { key: "/admin/modification", label: "Modification", icon: <Filter size={18} /> },
      { key: "/admin/pre-inscription", label: "Pré-inscription", icon: <UserPlus size={18} /> },
      { key: "/notes/resultats", label: "Résultats", icon: <BarChart3 size={18} /> },
    );
  }

  if (user?.role === "Admin") {
    tabs.push(
      { key: "/utilisateur/dashboard", label: "Dashboard", icon: <BarChart3 size={18} /> },
      { key: "/admin/inscription", label: "Inscription", icon: <BarChart3 size={18} /> },
      { key: "/admin/users", label: "Users", icon: <Users size={18} /> },
      { key: "/utilisateur/inscription", label: "Réinscription", icon: <Users size={18} /> },
      { key: "/utilisateur/filtrage", label: "Filtrage", icon: <Filter size={18} /> },
      { key: "/admin/modification", label: "Modification", icon: <Filter size={18} /> },
      { key: "/admin/changerNiveauEtudiant", label: "Changer Niveau", icon: <Filter size={18} /> },
      { key: "/admin/pre-inscription", label: "Pré-inscription", icon: <UserPlus size={18} /> },
      { key: "/admin/parcours", label: "Parcours", icon: <ShieldCheck size={18} /> },
      { key: "/admin/mentions", label: "Chef Mention", icon: <Users size={18} /> },
      { key: "/admin/export", label: "Exportation", icon: <Download size={18} /> },
      { key: "/notes/admin?tab=dashboard", label: "Dashboard Notes", icon: <BarChart3 size={18} /> },
      { key: "/notes/admin?tab=ue",        label: "UE",               icon: <Library size={18} /> },
      { key: "/notes/admin?tab=matieres",  label: "Matières",         icon: <Layers size={18} /> },
      { key: "/notes/chef-mention", label: "Matières & Coefficients", icon: <ClipboardList size={18} /> },
      { key: "/notes/resultats",    label: "Résultats",               icon: <BarChart3 size={18} /> },
      { key: "/notes/professeur",   label: "Mes Matières",            icon: <BookOpen size={18} /> },
    );
  }

  if (user?.role === "Professeur") {
    tabs.push(
      { key: "/notes/professeur", label: "Mes Matières", icon: <BookOpen size={18} /> },
    );
  }

  if (user?.role === "ChefMention") {
    tabs.push(
      { key: "/notes/chef-mention", label: "Matières & Coefficients", icon: <ClipboardList size={18} /> },
      { key: "/notes/resultats", label: "Résultats", icon: <BarChart3 size={18} /> },
    );
  }

  if (user?.role === "Ecolage") {
    tabs.push(
      { key: "/ecolage/insertion", label: "Insertion Paiement", icon: <PlusCircle size={18} /> },
    );
  }

  return (
    <div className="relative mb-8 w-full bg-white/60 backdrop-blur-md rounded-2xl border border-gray-100 p-1.5 shadow-sm">
      
      {/* Overlay dégradé + bouton gauche */}
      {canScrollLeft && (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white via-white/80 to-transparent z-20 pointer-events-none rounded-l-2xl" />
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-xl border border-gray-100 text-gray-600 hover:text-indigo-600 hover:scale-110 active:scale-95 transition-all"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
        </>
      )}

      {/* Zone de scroll */}
      <div
        ref={scrollRef}
        className="overflow-x-auto scroll-smooth no-scrollbar flex items-center"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex items-center gap-1.5 px-2">
          {tabs.map((tab) => {
            const [tabPath, tabQuery] = tab.key.split("?tab=");
            const isActive = tabQuery
              ? pathname === tabPath && searchParams.get("tab") === tabQuery
              : pathname === tab.key;

            return (
              <Link
                key={tab.key}
                href={tab.key}
                ref={isActive ? activeTabRef : null}
                className={`
                  group relative flex items-center gap-2.5 px-5 py-3 text-sm font-semibold rounded-xl whitespace-nowrap transition-all duration-300
                  ${isActive 
                    ? "text-indigo-700 bg-indigo-50 shadow-inner" 
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  }
                `}
              >
                <span className={`transition-transform duration-300 ${isActive ? "scale-110 text-indigo-600" : "text-gray-400 group-hover:text-gray-600"}`}>
                  {tab.icon}
                </span>
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-600" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Overlay dégradé + bouton droit */}
      {canScrollRight && (
        <>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white via-white/80 to-transparent z-20 pointer-events-none rounded-r-2xl" />
          <button
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-xl border border-gray-100 text-gray-600 hover:text-indigo-600 hover:scale-110 active:scale-95 transition-all"
          >
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>
        </>
      )}

      {/* Style injecté pour masquer la scrollbar proprement partout */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}