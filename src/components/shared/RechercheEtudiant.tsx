"use client";

import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface EtudiantBase {
  id: number | string;
  nom: string;
  prenom: string;
  mention?: string;
  niveau?: string;
}

interface Props<T extends EtudiantBase> {
  nom: string;
  prenom: string;
  loading: boolean;
  resultats: T[];
  etudiantSelectionne: T | null;
  onNomChange: (v: string) => void;
  onPrenomChange: (v: string) => void;
  onRecherche: () => void;
  onSelectEtudiant: (e: T) => void;
}

export default function RechercheEtudiant<T extends EtudiantBase>({
  nom,
  prenom,
  loading,
  resultats,
  etudiantSelectionne,
  onNomChange,
  onPrenomChange,
  onRecherche,
  onSelectEtudiant,
}: Props<T>) {
  return (
    <div className="mb-8 p-4 bg-slate-50 border rounded-xl">
      <Label className="text-slate-600 font-bold mb-4 block italic">
        Rechercher un étudiant
      </Label>
      <div className="grid md:grid-cols-5 gap-3 items-end">
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="rech-nom">Nom</Label>
          <Input
            id="rech-nom"
            placeholder="Nom"
            value={nom}
            onChange={(e) => onNomChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onRecherche()}
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="rech-prenom">Prénom</Label>
          <Input
            id="rech-prenom"
            placeholder="Prénom"
            value={prenom}
            onChange={(e) => onPrenomChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onRecherche()}
          />
        </div>
        <Button
          onClick={onRecherche}
          disabled={loading || !nom.trim()}
          className="bg-blue-900 text-white"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Search className="w-4 h-4 mr-2" />
          )}
          Rechercher
        </Button>
      </div>

      {resultats.length > 0 && (
        <div className="mt-4 border rounded-lg divide-y bg-white shadow-sm max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
          {resultats.map((etudiant) => (
            <button
              key={etudiant.id}
              type="button"
              onClick={() => onSelectEtudiant(etudiant)}
              className={`w-full text-left px-4 py-3 hover:bg-slate-100 transition ${
                etudiantSelectionne?.id === etudiant.id ? "bg-blue-50" : ""
              }`}
            >
              <p className="font-semibold text-slate-800">
                {etudiant.nom} {etudiant.prenom}
              </p>
              {(etudiant.mention || etudiant.niveau) && (
                <p className="text-xs text-slate-500">
                  {[etudiant.mention, etudiant.niveau].filter(Boolean).join(" — ")}
                </p>
              )}
            </button>
          ))}
        </div>
      )}

      {/* {resultats.length === 0 && nom && !loading && (
        <p className="mt-4 text-sm text-slate-400">Aucun étudiant trouvé.</p>
      )} */}
    </div>
  );
}
