"use client";

import Link from "next/link";
import { BarChart3, Filter, Users, PlusCircle, Search, ShieldCheck, UserPlus, Download, BookOpen, ClipboardList, Layers, Library } from "lucide-react";
import { User } from "@/lib/db";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";

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
    <div className="overflow-x-auto mb-8 border-b border-border">
      <div className="flex min-w-max gap-2">
        {tabs.map((tab) => {
          const [tabPath, tabQuery] = tab.key.split("?tab=");
          const isActive = tabQuery
            ? pathname === tabPath && searchParams.get("tab") === tabQuery
            : pathname === tab.key;

          return (
            <Link
              key={tab.key}
              href={tab.key}
              className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${isActive
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
            >
              {tab.icon}
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}