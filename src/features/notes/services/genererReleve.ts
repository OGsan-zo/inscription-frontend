import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { EtudiantRecherche, ResultatEtudiant, NoteUE } from "../types/notes";

// ── Chemins des logos (à modifier selon vos assets) ──────────────────────────
const LOGO_GAUCHE = "/espaLogo.jpeg";   // Logo Université / ITU — à remplacer
const LOGO_DROIT  = "/espa-logo.png";  // Logo ESPA / Ministère — à remplacer

// ─────────────────────────────────────────────────────────────────────────────

export interface GenererReleveParams {
  etudiant: EtudiantRecherche;
  semestreName: string;
  anneeUniversitaire?: string;
  resultat: ResultatEtudiant;
}

const loadImage = (url: string): Promise<string | null> =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/jpeg"));
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });

// ── Couleurs ──────────────────────────────────────────────────────────────────
const C_NORMAL     = [41,  82,  163] as [number, number, number]; // bleu
const C_RATTRAPAGE = [175, 100,   0] as [number, number, number]; // ambre
const C_UE_BG      = [197, 210, 240] as [number, number, number]; // bleu clair
const C_TOTAL_BG   = [240, 240, 240] as [number, number, number]; // gris clair
const C_GREEN      = [0,  110,  50]  as [number, number, number];
const C_RED        = [180,  0,   0]  as [number, number, number];
const C_WHITE      = [255, 255, 255] as [number, number, number];

export async function genererReleve({
  etudiant,
  semestreName,
  anneeUniversitaire = "2025-2026",
  resultat,
}: GenererReleveParams) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageW  = doc.internal.pageSize.getWidth();
  const margin = 10;

  // ── Chargement des logos ────────────────────────────────────────────────────
  const [logoG, logoD] = await Promise.all([
    loadImage(LOGO_GAUCHE),
    loadImage(LOGO_DROIT),
  ]);

  // ── Header ─────────────────────────────────────────────────────────────────
  const logoH = 22;
  const logoW = 22;
  const logoTop = 7;

  if (logoG) doc.addImage(logoG, "JPEG", margin, logoTop, logoW, logoH);
  if (logoD) doc.addImage(logoD, "JPEG", pageW - margin - logoW, logoTop, logoW, logoH);

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("UNIVERSITE D'ANTANANARIVO", pageW / 2, 13, { align: "center" });

  doc.setFontSize(10);
  doc.text("ECOLE SUPERIEURE POLYTECHNIQUE D'ANTANANARIVO", pageW / 2, 18, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text("Domaine : SCIENCE DE L'INGENIEUR", pageW / 2, 23, { align: "center" });
  doc.text(`Mention : ${etudiant.mention ?? ""}`, pageW / 2, 27, { align: "center" });
  doc.text(`Niveau : ${etudiant.niveau ?? ""}`, pageW / 2, 31, { align: "center" });

  // ── Titre ──────────────────────────────────────────────────────────────────
  let y = 38;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(
    `RELEVE DES NOTES DE L'ETUDIANT ET RESULTATS DU SEMESTRE ${semestreName}`,
    pageW / 2, y, { align: "center" }
  );
  y += 5.5;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Année Universitaire : ${anneeUniversitaire}`, pageW / 2, y, { align: "center" });
  y += 7;

  // ── Infos étudiant ─────────────────────────────────────────────────────────
  const labelW = 20;
  const col2X  = pageW / 2 - 10;

  const infoLine = (label: string, value: string, x: number, lineY: number) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${label} :`, x, lineY);
    doc.setFont("helvetica", "normal");
    doc.text(value, x + labelW, lineY);
  };

  infoLine("Nom",    etudiant.nom,    margin, y);
  infoLine("Prénom", etudiant.prenom, col2X,  y);
  y += 5;
  infoLine("Né le",  "",              margin, y);
  infoLine("N° Inscription", String(etudiant.id), col2X, y);
  y += 7;

  // ── Construction du corps du tableau ───────────────────────────────────────
  const sessionNormale     = resultat.find((s) => s.type === "Normale");
  const sessionRattrapage  = resultat.find((s) => s.type === "Rattrapage");

  // UEs de référence (session normale, ou rattrapage si pas de normale)
  const uesRef: NoteUE[] = sessionNormale?.notesListes ?? sessionRattrapage?.notesListes ?? [];

  type CellDef = {
    content: string | number;
    colSpan?: number;
    styles?: Record<string, unknown>;
  };
  type BodyRow = (string | number | CellDef)[];

  const body: BodyRow[] = [];

  const ueHeaderStyle = {
    fillColor: C_UE_BG,
    fontStyle: "bold",
    halign: "left",
    fontSize: 8,
    textColor: [20, 50, 120] as [number, number, number],
  };

  const totalStyle = (isValid: boolean) => ({
    fillColor: C_TOTAL_BG,
    fontStyle: "bold",
    fontSize: 7.5,
    halign: "center",
    textColor: isValid ? C_GREEN : C_RED,
  });

  const ecStyle = { fontSize: 7.5, fillColor: C_WHITE, halign: "center" };
  const dash    = { content: "—", styles: { ...ecStyle } } as CellDef;

  for (const ue of uesRef) {
    const ueR = sessionRattrapage?.notesListes.find((u) => u.ue === ue.ue);

    // ── Ligne UE ──────────────────────────────────────────────────────────────
    body.push([
      { content: ue.ue, colSpan: 11, styles: ueHeaderStyle } as CellDef,
    ]);

    // ── Lignes EC ─────────────────────────────────────────────────────────────
    for (let i = 0; i < ue.notes.length; i++) {
      const ec  = ue.notes[i];
      const ecR = ueR?.notes[i];

      body.push([
        {
          content: ec.matiere,
          styles: { ...ecStyle, halign: "left", cellPadding: { left: 5, right: 2, top: 1, bottom: 1 } },
        } as CellDef,
        { content: ec.coefficient,           styles: ecStyle } as CellDef,
        dash,                                         // crédit (non dispo)
        { content: ec.note,                  styles: ecStyle } as CellDef,
        { content: ec.noteAvecCoefficient,   styles: ecStyle } as CellDef,
        dash,                                         // UE/20 — vide par EC
        dash,                                         // Résultat — vide par EC
        { content: ecR ? ecR.note               : "—", styles: ecStyle } as CellDef,
        { content: ecR ? ecR.noteAvecCoefficient : "—", styles: ecStyle } as CellDef,
        dash,                                         // UE/20 rattrapage — vide
        dash,                                         // Résultat rattrapage — vide
      ]);
    }

    // ── Ligne TOTAL ───────────────────────────────────────────────────────────
    const ts  = totalStyle(ue.isValid);
    const tsR = ueR ? totalStyle(ueR.isValid) : null;

    body.push([
      {
        content: "TOTAL",
        styles: { ...ts, halign: "left", fillColor: C_TOTAL_BG, textColor: [80, 80, 80] as [number, number, number], cellPadding: { left: 5, right: 2, top: 1.5, bottom: 1.5 } },
      } as CellDef,
      { content: ue.sommeCoefficients,          styles: { ...ts, textColor: [80, 80, 80] as [number, number, number], fillColor: C_TOTAL_BG } } as CellDef,
      dash,
      dash,
      { content: ue.sommeNotesAvecCoefficient,  styles: { ...ts, textColor: [80, 80, 80] as [number, number, number], fillColor: C_TOTAL_BG } } as CellDef,
      { content: String(ue.moyenne),            styles: ts } as CellDef,
      { content: ue.isValid ? "UE validée" : "Non validée", styles: ts } as CellDef,
      { content: ueR ? "—" : "—",              styles: { ...ecStyle, fillColor: C_TOTAL_BG } } as CellDef,
      { content: ueR ? String(ueR.sommeNotesAvecCoefficient) : "—", styles: tsR ? { ...tsR, fillColor: C_TOTAL_BG } : { ...ecStyle, fillColor: C_TOTAL_BG } } as CellDef,
      { content: ueR ? String(ueR.moyenne) : "—",             styles: tsR ?? { ...ecStyle, fillColor: C_TOTAL_BG } } as CellDef,
      { content: ueR ? (ueR.isValid ? "UE validée" : "Non validée") : "—", styles: tsR ?? { ...ecStyle, fillColor: C_TOTAL_BG } } as CellDef,
    ]);
  }

  // ── Tableau principal ──────────────────────────────────────────────────────
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [
      [
        { content: "UE: Unité d'Enseignement\nEC: Éléments Constitutifs", rowSpan: 2, styles: { halign: "center", valign: "middle", fontSize: 7, fontStyle: "bold", fillColor: [80, 80, 80] as [number, number, number] } },
        { content: "Coefficient", rowSpan: 2, styles: { halign: "center", valign: "middle", fontSize: 7, fillColor: [80, 80, 80] as [number, number, number] } },
        { content: "Crédit",      rowSpan: 2, styles: { halign: "center", valign: "middle", fontSize: 7, fillColor: [80, 80, 80] as [number, number, number] } },
        { content: "SESSION NORMALE",     colSpan: 4, styles: { halign: "center", fontSize: 7.5, fontStyle: "bold", fillColor: C_NORMAL } },
        { content: "SESSION DE RATTRAPAGE", colSpan: 4, styles: { halign: "center", fontSize: 7.5, fontStyle: "bold", fillColor: C_RATTRAPAGE } },
      ],
      [
        { content: "EC/20",       styles: { halign: "center", fontSize: 7, fillColor: C_NORMAL } },
        { content: "EC avec coef",styles: { halign: "center", fontSize: 7, fillColor: C_NORMAL } },
        { content: "UE/20",       styles: { halign: "center", fontSize: 7, fillColor: C_NORMAL } },
        { content: "Résultat",    styles: { halign: "center", fontSize: 7, fillColor: C_NORMAL } },
        { content: "EC/20",       styles: { halign: "center", fontSize: 7, fillColor: C_RATTRAPAGE } },
        { content: "EC avec coef",styles: { halign: "center", fontSize: 7, fillColor: C_RATTRAPAGE } },
        { content: "UE/20",       styles: { halign: "center", fontSize: 7, fillColor: C_RATTRAPAGE } },
        { content: "Résultat",    styles: { halign: "center", fontSize: 7, fillColor: C_RATTRAPAGE } },
      ],
    ],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: body as any,
    columnStyles: {
      0:  { cellWidth: 62 },
      1:  { cellWidth: 18 },
      2:  { cellWidth: 14 },
      3:  { cellWidth: 15 },
      4:  { cellWidth: 20 },
      5:  { cellWidth: 14 },
      6:  { cellWidth: 22 },
      7:  { cellWidth: 15 },
      8:  { cellWidth: 20 },
      9:  { cellWidth: 14 },
      10: { cellWidth: 22 },
    },
    styles: {
      fontSize: 8,
      cellPadding: 1.5,
      lineColor: [180, 180, 180] as [number, number, number],
      lineWidth: 0.1,
      textColor: [20, 20, 20] as [number, number, number],
    },
    headStyles: {
      fillColor: C_NORMAL,
      textColor: [255, 255, 255] as [number, number, number],
      fontStyle: "bold",
    },
    theme: "grid",
  });

  // ── Résumé semestriel ──────────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finalY = (doc as any).lastAutoTable.finalY + 5;

  autoTable(doc, {
    startY: finalY,
    margin: { left: margin, right: margin },
    head: [
      [
        { content: `RESULTAT PARTIEL DU SEMESTRE ${semestreName}`, colSpan: 3, styles: { halign: "left", fontStyle: "bold", fontSize: 9, fillColor: [60, 60, 60] as [number, number, number] } },
      ],
      [
        "",
        { content: "SESSION NORMALE",     styles: { halign: "center", fillColor: C_NORMAL } },
        { content: "SESSION DE RATTRAPAGE", styles: { halign: "center", fillColor: C_RATTRAPAGE } },
      ],
    ],
    body: [
      ["Nombre total des crédits des UE",  "30", "30"],
      ["Nombre des crédits acquis",         "—",  "—"],
      [
        "Moyenne semestrielle",
        sessionNormale    ? String(sessionNormale.moyenne)    : "—",
        sessionRattrapage ? String(sessionRattrapage.moyenne) : "—",
      ],
      ["Résultat", "—", "—"],
    ],
    columnStyles: {
      0: { cellWidth: 85, fontStyle: "bold" },
      1: { cellWidth: 50, halign: "center" },
      2: { cellWidth: 50, halign: "center" },
    },
    styles: { fontSize: 8.5, cellPadding: 2 },
    headStyles: { fillColor: [60, 60, 60] as [number, number, number], textColor: [255, 255, 255] as [number, number, number], fontStyle: "bold" },
    theme: "grid",
  });

  // ── Enregistrement ─────────────────────────────────────────────────────────
  doc.save(`releve_${etudiant.nom}_${etudiant.prenom}_${semestreName}.pdf`);
}
