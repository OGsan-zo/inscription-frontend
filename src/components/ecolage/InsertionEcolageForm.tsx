"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, CheckCircle2, History, UserCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ecolageService } from "@/services/ecolageService"
import { EcolageHistoryTable } from "@/components/ecolage/EcolageHistoryTable"
import { EtudiantEcolageDetail } from "@/types/ecolage"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { ScolariteLoader } from "./sousComponent/ScolariteLoader"
import { useRechercheEtudiant } from "@/hooks/useRechercheEtudiant"
import RechercheEtudiant from "@/components/shared/RechercheEtudiant"

export function InsertionEcolageForm() {
    const router = useRouter()
    const login = process.env.NEXT_PUBLIC_LOGIN_URL || '/login'

    const [selectedStudent, setSelectedStudent] = useState<EtudiantEcolageDetail | null>(null)
    const [loadingDetails, setLoadingDetails] = useState(false)
    const [showHistory, setShowHistory] = useState(false)
    const [lastUpdatedHistory, setLastUpdatedHistory] = useState(Date.now())
    const [formation, setFormation] = useState<any>(null)

    const [registrationId, setRegistrationId] = useState("")
    const [refBordereau, setRefBordereau] = useState("")
    const [montant, setMontant] = useState("")
    const [datePaiement, setDatePaiement] = useState(new Date().toISOString().split('T')[0])
    const [loadingSubmit, setLoadingSubmit] = useState(false)

    const { nom, prenom, resultats, loading: loadingRecherche, setNom, setPrenom, setResultats, rechercher } = useRechercheEtudiant({
        onBeforeSearch: () => { setSelectedStudent(null); setRegistrationId(""); },
        onAuthError: async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push(login);
        },
    });

    const fetchEtudiant = async (idEtudiant: number | string) => {
        setLoadingDetails(true);
        try {
            const res = await fetch(`/api/etudiants?idEtudiant=${encodeURIComponent(idEtudiant)}`);
            if (res.status === 401 || res.status === 403) {
                await fetch("/api/auth/logout", { method: "POST" });
                router.push(login);
                return;
            }
            const response = await res.json();
            if (!res.ok) throw new Error(response.error || "Erreur");

            const identite = response.data.identite;
            const ecolageRes = await ecolageService.fetchStudentEcolageDetails(idEtudiant);
            const registrations = ecolageRes.data || [];

            setFormation(response.data.formation);
            setSelectedStudent({
                id: Number(idEtudiant),
                nom: identite.nom,
                prenom: identite.prenom,
                dateNaissance: identite.dateNaissance || "",
                sexe: identite.sexe || "",
                contact: identite.contact || {},
                formation: response.data.formation,
                registrations: registrations.map((reg: any) => ({
                    ...reg,
                    id_niveau_etudiant: reg.id_niveau_etudiant,
                    niveau: reg.niveau,
                    annee_scolaire: reg.annee_scolaire,
                    reste_a_payer: reg.reste_a_payer
                }))
            });
            toast.info(`Détails chargés pour : ${identite.nom}`);
        } catch (err: any) {
            toast.error(err.message || "Erreur lors du chargement des détails");
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedStudent || !registrationId || !refBordereau || !montant) {
            toast.error("Veuillez remplir tous les champs obligatoires")
            return
        }

        const selectedReg = selectedStudent.registrations.find(
            r => r.id_niveau_etudiant.toString() === registrationId
        );

        if (!selectedReg) {
            toast.error("Inscription non trouvée");
            return;
        }

        setLoadingSubmit(true)

        const payload = {
            etudiant_id: Number(selectedStudent.id),
            annee_scolaire: selectedReg.annee_scolaire,
            montant: Number(montant),
            date_paiement: datePaiement,
            ref_bordereau: refBordereau
        }

        try {
            await ecolageService.savePaiement(payload)
            toast.success("Paiement enregistré avec succès pour " + selectedReg.niveau)
            setRegistrationId("")
            setRefBordereau("")
            setMontant("")
            setShowHistory(false)
            fetchEtudiant(selectedStudent.id)
            setLastUpdatedHistory(Date.now())
        } catch (err: any) {
            toast.error(err.message || "Erreur lors de l'enregistrement")
        } finally {
            setLoadingSubmit(false)
        }
    }

    return (
        <div className="space-y-6">
            <RechercheEtudiant
                nom={nom}
                prenom={prenom}
                loading={loadingRecherche}
                resultats={resultats}
                etudiantSelectionne={null}
                onNomChange={setNom}
                onPrenomChange={setPrenom}
                onRecherche={rechercher}
                onSelectEtudiant={(e) => { setResultats([]); fetchEtudiant(e.id); }}
            />

            {loadingDetails && (
                <div className="flex justify-center py-10">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-900" />
                </div>
            )}

            {selectedStudent && (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="p-5 bg-blue-50/50 border-l-4 border-blue-900 rounded-r-lg flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-100 p-2 rounded-full">
                                <CheckCircle2 className="w-6 h-6 text-blue-900" />
                            </div>
                            <div>
                                <p className="text-sm text-blue-700 font-medium">Étudiant sélectionné :</p>
                                <p className="text-xl font-bold text-slate-900 uppercase">
                                    {selectedStudent.nom} <span className="capitalize font-semibold">{selectedStudent.prenom}</span>
                                    {formation?.mention && (
                                        <span className="ml-3 text-sm font-normal bg-blue-100 text-blue-800 px-2 py-1 rounded-full uppercase tracking-wider">
                                            {formation.mention}
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setShowHistory(!showHistory)}
                            className="bg-white hover:bg-slate-50 text-blue-900 border-blue-200"
                        >
                            <History className="w-4 h-4 mr-2" />
                            {showHistory ? "Masquer historiques" : "Consulter historiques"}
                        </Button>
                    </div>

                    <Card className="border-none shadow-md overflow-hidden">
                        <CardContent className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <Label className="text-sm font-bold text-slate-700">Sélectionner le Niveau / Année *</Label>
                                            {selectedStudent.registrations && selectedStudent.registrations.length > 0 ? (
                                                <Select value={registrationId} onValueChange={setRegistrationId}>
                                                    <SelectTrigger className="w-full h-11">
                                                        <SelectValue placeholder="Choisir une inscription" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {selectedStudent.registrations.map((reg) => {
                                                            const isSolded = reg.reste_a_payer <= 0;
                                                            return (
                                                                <SelectItem
                                                                    key={reg.id_niveau_etudiant}
                                                                    value={reg.id_niveau_etudiant.toString()}
                                                                    disabled={isSolded}
                                                                    className={cn(isSolded && "opacity-60 grayscale")}
                                                                >
                                                                    <div className="flex justify-between w-full font-medium">
                                                                        <span>{reg.niveau} ({reg.annee_scolaire}) — Reste : {isSolded ? "0 (Soldé)" : `${reg.reste_a_payer.toLocaleString()} Ar`}</span>
                                                                    </div>
                                                                </SelectItem>
                                                            );
                                                        })}
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <div className="p-3 bg-red-50 border border-red-100 rounded text-red-600 text-sm italic">
                                                    Aucune inscription trouvée pour cet étudiant.
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            <Label htmlFor="ref" className="text-sm font-bold text-slate-700">Référence Bordereau (REF) *</Label>
                                            <Input
                                                id="ref"
                                                className="h-11"
                                                placeholder="Ex: BORD-12345"
                                                value={refBordereau}
                                                onChange={(e: any) => setRefBordereau(e.target.value.toUpperCase())}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <Label htmlFor="montant" className="text-sm font-bold text-slate-700">Montant Versé *</Label>
                                            <div className="relative">
                                                <Input
                                                    id="montant"
                                                    type="number"
                                                    className="h-11 pr-12 text-lg font-bold text-blue-900"
                                                    placeholder="Montant en Ar"
                                                    value={montant}
                                                    onChange={(e: any) => setMontant(e.target.value)}
                                                />
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                                                    Ar
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label htmlFor="datePaiement" className="text-sm font-bold text-slate-700">Date de Paiement *</Label>
                                            <Input
                                                id="datePaiement"
                                                type="date"
                                                className="h-11"
                                                value={datePaiement}
                                                onChange={(e: any) => setDatePaiement(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loadingSubmit || !registrationId}
                                    className="w-full h-14 text-xl font-bold bg-green-700 hover:bg-green-800 shadow-lg shadow-green-100 transition-all active:scale-[0.98]"
                                >
                                    {loadingSubmit ? <Loader2 className="mr-2 animate-spin size-6" /> : null}
                                    ENREGISTRER LE PAIEMENT
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {showHistory && (
                        <div className="animate-in slide-in-from-bottom-6 duration-500">
                            <EcolageHistoryTable
                                idEtudiant={selectedStudent.id}
                                lastUpdated={lastUpdatedHistory}
                                mention={formation?.mention}
                                onAnnulerSuccess={() => fetchEtudiant(selectedStudent.id)}
                            />
                            <ScolariteLoader idEtudiant={selectedStudent.id} />
                        </div>
                    )}
                </div>
            )}

            {!selectedStudent && !loadingDetails && (
                <div className="py-24 text-center border-2 border-dashed rounded-2xl bg-slate-50/50 border-slate-200">
                    <UserCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 text-lg">
                        Veuillez rechercher et sélectionner un étudiant pour enregistrer un paiement.
                    </p>
                </div>
            )}
        </div>
    )
}
