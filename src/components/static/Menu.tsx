"use client";

import Link from "next/link";
import { BarChart3, Filter, Users, PlusCircle, ShieldCheck, UserPlus, Download, BookOpen, ClipboardList, Layers, Library, ChevronLeft, ChevronRight } from "lucide-react";
import { User } from "@/lib/db";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useRef, useState, useEffect, useCallback } from "react";

interface MenuProps {
  user: User | null;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

// Définition d'une interface pour les onglets pour sécuriser le typage
interface TabItem {
  key: string;
  label: string;
  icon: React.ReactNode;
}

export default function Menu({ user, activeTab, setActiveTab }: MenuProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState);
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -160 : 160, behavior: "smooth" });
  };

  // On initialise le tableau avec le type TabItem[]
  const tabs: TabItem[] = [];

  // Onglets pour le rôle Utilisateur
  if (user?.role === "Utilisateur") {
    tabs.push(
      {
        key: "/utilisateur/dashboard",
        label: "Dashboard",
        icon: <BarChart3 size={18} />,
      },
      {
        key: "/utilisateur/inscription",
        label: "Réinscription",
        icon: <Users size={18} />,
      },
      {
        key: "/utilisateur/filtrage", // Corrigé : minuscule
        label: "Filtrage",
        icon: <Filter size={18} />, // Corrigé : minuscule
      },
      {
        key: "/admin/modification",
        label: "Modification",
        icon: <Filter size={18} />,
      },
      /*    {
   
           key: "/admin/inscription",
           label: "Ajout Etudiant",
           icon: <BarChart3 size={18} />,
         },
         */
      {
        key: "/admin/pre-inscription",
        label: "Pré-inscription",
        icon: <UserPlus size={18} />,

      },
      {
        key: "/notes/resultats",
        label: "Résultats",
        icon: <BarChart3 size={18} />,
      },
    );
  }

  // Onglets pour le rôle Admin
  if (user?.role === "Admin") {
    tabs.push(
      {
        key: "/utilisateur/dashboard",
        label: "Dashboard",
        icon: <BarChart3 size={18} />,
      },
      {
        key: "/admin/inscription",
        label: "Inscription",
        icon: <BarChart3 size={18} />,
      },
      {
        key: "/admin/users",
        label: "Users",
        icon: <Users size={18} />,
      },
      {
        key: "/utilisateur/inscription",
        label: "Réinscription",
        icon: <Users size={18} />,
      },
      {
        key: "/utilisateur/filtrage", // Corrigé : minuscule
        label: "Filtrage",
        icon: <Filter size={18} />, // Corrigé : minuscule
      },
      {
        key: "/admin/modification",
        label: "Modification",
        icon: <Filter size={18} />,
      },
      {
        key: "/admin/changerNiveauEtudiant",
        label: "Changer Niveau",
        icon: <Filter size={18} />,
      },
      {
        key: "/admin/pre-inscription",
        label: "Pré-inscription",
        icon: <UserPlus size={18} />,
      },
      {
        key: "/admin/parcours",
        label: "Parcours",
        icon: <ShieldCheck size={18} />,
      },
      {
        key: "/admin/export",
        label: "Exportation des données",
        icon: <Download size={18} />,
      },
      {
        key: "/notes/admin?tab=matieres",
        label: "Matières",
        icon: <Layers size={18} />,
      },
      {
        key: "/notes/admin?tab=ue",
        label: "UE",
        icon: <Library size={18} />,
      },
      {
        key: "/notes/admin?tab=coeff",
        label: "Coeff & Mention",
        icon: <ClipboardList size={18} />,
      },
    );
  }

  // Onglets pour le rôle Professeur
  if (user?.role === "Professeur") {
    tabs.push(
      {
        key: "/notes/professeur",
        label: "Mes Matières",
        icon: <BookOpen size={18} />,
      },
    );
  }

  // Onglets pour le rôle ChefMention
  if (user?.role === "ChefMention") {
    tabs.push(
      {
        key: "/notes/chef-mention",
        label: "Matières & Coefficients",
        icon: <ClipboardList size={18} />,
      },
      {
        key: "/notes/resultats",
        label: "Résultats",
        icon: <BarChart3 size={18} />,
      },
    );
  }

  // Onglets pour le rôle Ecolage
  if (user?.role === "Ecolage") {
    tabs.push(
      {
        key: "/ecolage/insertion",
        label: "Insertion Paiement",
        icon: <PlusCircle size={18} />,
      },
    );
  }

  return (
    <div className="relative mb-8">
      {/* Bouton gauche */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
          aria-label="Défiler à gauche"
        >
          <ChevronLeft size={16} className="text-gray-600" />
        </button>
      )}

      {/* Fondu gauche */}
      {canScrollLeft && (
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-background to-transparent z-10" />
      )}

      <div
        ref={scrollRef}
        className="overflow-x-auto border-b border-border"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
      >
        <div className="flex min-w-max gap-1 px-1">
          {tabs.map((tab) => {
            const [tabPath, tabQuery] = tab.key.split("?tab=");
            const isActive = tabQuery
              ? pathname === tabPath && searchParams.get("tab") === tabQuery
              : pathname === tab.key;

            return (
              <Link
                key={tab.key}
                href={tab.key}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-md border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? "border-indigo-600 text-indigo-600 bg-indigo-50"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                <span className={`${isActive ? "text-indigo-500" : "text-muted-foreground"} transition-colors`}>
                  {tab.icon}
                </span>
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Fondu droit */}
      {canScrollRight && (
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-background to-transparent z-10" />
      )}

      {/* Bouton droit */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
          aria-label="Défiler à droite"
        >
          <ChevronRight size={16} className="text-gray-600" />
        </button>
      )}
    </div>
  );
}