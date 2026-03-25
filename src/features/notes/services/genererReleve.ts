import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import type { EtudiantRecherche, ResultatEtudiant } from "../types/notes";

// ─────────────────────────────────────────────────────────────────────────────

export interface GenererReleveParams {
  etudiant: EtudiantRecherche;
  semestreName: string;
  anneeUniversitaire?: string;
  resultat: ResultatEtudiant;
}

// ── Chemins des logos ─────────────────────────────────────────────────────────
const LOGO_GAUCHE = "/espaLogo.jpeg";
const LOGO_DROIT  = "/espa-logo.png";

// ── Couleurs ARGB — calquées sur le CSS de la page web ────────────────────────
// bg-blue-900   → #1e3a8a
const C_SESSION_NORMALE    = "FF1E3A8A";
// bg-amber-600  → #d97706
const C_SESSION_RATTRAPAGE = "FFD97706";
// bg-emerald-700 → #15803d
const C_SESSION_FINAL      = "FF15803D";
// bg-indigo-100 → #e0e7ff   text-indigo-900 → #1e1b4b
const C_UE_BG   = "FFE0E7FF";
const C_UE_TEXT = "FF1E1B4B";
// bg-slate-100  → #f1f5f9
const C_TOTAL_BG = "FFF1F5F9";
// bg-slate-50   → #f8fafc  (header colonnes)
const C_HDR_BG  = "FFF8FAFC";
// texte slate-500 → #64748b
const C_HDR_TXT = "FF64748B";

const C_WHITE = "FFFFFFFF";
const C_GREEN = "FF15803D"; // emerald-700
const C_RED   = "FFBe123C"; // rose-700
const C_TITLE = "FF8B0000"; // rouge institution

const COL_COUNT = 6; // A → F

// ── Helpers ───────────────────────────────────────────────────────────────────

function applyBorder(row: ExcelJS.Row, cols = COL_COUNT) {
  for (let c = 1; c <= cols; c++) {
    row.getCell(c).border = {
      top:    { style: "thin", color: { argb: "FFE2E8F0" } },
      left:   { style: "thin", color: { argb: "FFE2E8F0" } },
      bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
      right:  { style: "thin", color: { argb: "FFE2E8F0" } },
    };
  }
}

function applyFill(row: ExcelJS.Row, argb: string, cols = COL_COUNT) {
  for (let c = 1; c <= cols; c++) {
    row.getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb } };
  }
}

function cell(
  row: ExcelJS.Row,
  col: number,
  value: string | number,
  opts: {
    bold?: boolean; size?: number; color?: string;
    align?: ExcelJS.Alignment["horizontal"]; indent?: number;
    italic?: boolean; underline?: boolean;
  } = {}
) {
  const c = row.getCell(col);
  c.value = value;
  c.font = {
    bold: opts.bold ?? false, size: opts.size ?? 9,
    italic: opts.italic ?? false, underline: opts.underline ?? false,
    color: { argb: opts.color ?? "FF000000" },
  };
  c.alignment = {
    horizontal: opts.align ?? "center", vertical: "middle",
    indent: opts.indent ?? 0, wrapText: true,
  };
}

async function fetchBuffer(path: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(path);
    return res.ok ? res.arrayBuffer() : null;
  } catch { return null; }
}

function sessionColor(type: string): string {
  if (type === "Normale")    return C_SESSION_NORMALE;
  if (type === "Rattrapage") return C_SESSION_RATTRAPAGE;
  if (type === "Final")      return C_SESSION_FINAL;
  return "FF334155";
}

// ─────────────────────────────────────────────────────────────────────────────

export async function genererReleve({
  etudiant,
  semestreName,
  anneeUniversitaire = "2025-2026",
  resultat,
}: GenererReleveParams) {
  // ── Logos ──────────────────────────────────────────────────────────────────
  const [leftBuf, rightBuf] = await Promise.all([
    fetchBuffer(LOGO_GAUCHE),
    fetchBuffer(LOGO_DROIT),
  ]);

  // ── Workbook ───────────────────────────────────────────────────────────────
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "ESPA – Portail Inscription";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet(`Relevé ${semestreName}`);

  // ── Largeurs colonnes ──────────────────────────────────────────────────────
  sheet.columns = [
    { width: 44 }, // A – UE / EC
    { width: 12 }, // B – Coef
    { width: 10 }, // C – EC/20
    { width: 14 }, // D – EC×Coef
    { width: 10 }, // E – UE/20
    { width: 18 }, // F – Résultat
  ];

  let r = 1;

  // ── Helper : ligne fusionnée pleine largeur ────────────────────────────────
  const mergeRow = (text: string, opts: {
    bold?: boolean; size?: number; color?: string; fill?: string;
    italic?: boolean; height?: number; underline?: boolean; align?: ExcelJS.Alignment["horizontal"];
  } = {}) => {
    sheet.mergeCells(r, 1, r, COL_COUNT);
    const row = sheet.getRow(r);
    row.getCell(1).value = text;
    row.getCell(1).font  = {
      bold: opts.bold ?? false, size: opts.size ?? 10,
      italic: opts.italic ?? false, underline: opts.underline ?? false,
      color: { argb: opts.color ?? "FF000000" },
    };
    row.getCell(1).alignment = {
      horizontal: opts.align ?? "center", vertical: "middle",
    };
    if (opts.fill) {
      row.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: opts.fill } };
    }
    row.height = opts.height ?? 16;
    r++;
  };

  // ── En-tête institution (6 lignes — espace pour les logos) ────────────────
  mergeRow("UNIVERSITE D'ANTANANARIVO",
    { bold: true, size: 13, color: C_TITLE, underline: true, height: 22 });
  mergeRow("ECOLE SUPERIEURE POLYTECHNIQUE D'ANTANANARIVO",
    { bold: true, size: 11, color: C_TITLE, underline: true, height: 18 });
  mergeRow("Domaine : SCIENCE DE L'INGENIEUR", { size: 10, height: 16 });
  mergeRow(`Mention : ${etudiant.mention ?? ""}`,  { size: 10, height: 16 });
  mergeRow("Parcours :",                           { size: 10, height: 16 });
  mergeRow(`Niveau : ${etudiant.niveau ?? ""}`,    { size: 10, height: 16 });

  // ── Logos flottants (cols A–B gauche, cols E–F droite) ────────────────────
  if (leftBuf) {
    const ext = LOGO_GAUCHE.endsWith(".png") ? "png" : "jpeg";
    const id  = workbook.addImage({ buffer: leftBuf, extension: ext as "png" | "jpeg" });
    sheet.addImage(id, { tl: { col: 0, row: 0 }, br: { col: 2, row: 6 } } as ExcelJS.ImageRange);
  }
  if (rightBuf) {
    const ext = LOGO_DROIT.endsWith(".png") ? "png" : "jpeg";
    const id  = workbook.addImage({ buffer: rightBuf, extension: ext as "png" | "jpeg" });
    sheet.addImage(id, { tl: { col: 4, row: 0 }, br: { col: 6, row: 6 } } as ExcelJS.ImageRange);
  }

  mergeRow("", { height: 6 });

  // ── Titre ──────────────────────────────────────────────────────────────────
  mergeRow(
    `RELEVE DES NOTES DE L'ETUDIANT ET RESULTATS DU SEMESTRE ${semestreName}`,
    { bold: true, size: 12, color: C_TITLE, height: 22 }
  );
  mergeRow(`Année Universitaire : ${anneeUniversitaire}`, { italic: true, size: 10 });
  mergeRow("", { height: 6 });

  // ── Infos étudiant ─────────────────────────────────────────────────────────
  {
    const row = sheet.getRow(r);
    sheet.mergeCells(r, 1, r, 3);
    sheet.mergeCells(r, 4, r, 6);
    cell(row, 1, `Nom : ${etudiant.nom}`,       { bold: true, align: "left",  indent: 1 });
    cell(row, 4, `Prénom : ${etudiant.prenom}`,  { bold: true, align: "left" });
    row.height = 16;
    r++;
  }
  {
    const row = sheet.getRow(r);
    sheet.mergeCells(r, 1, r, 3);
    sheet.mergeCells(r, 4, r, 6);
    cell(row, 1, "Né le : ",                        { bold: true, align: "left", indent: 1 });
    cell(row, 4, `N° Inscription : ${etudiant.id}`,  { bold: true, align: "left" });
    row.height = 16;
    r++;
  }
  mergeRow("", { height: 8 });

  // ── Sessions ───────────────────────────────────────────────────────────────
  const sessionsAvecDonnees = resultat.filter((s) => s.notesListes.length > 0);

  for (const session of sessionsAvecDonnees) {
    const bgColor = sessionColor(session.type);

    // ── Bandeau session (identique au div coloré de la page web) ──────────
    {
      const row = sheet.getRow(r);
      sheet.mergeCells(r, 1, r, 4);
      sheet.mergeCells(r, 5, r, 6);

      const titleCell = row.getCell(1);
      titleCell.value = `Session ${session.type}`;
      titleCell.font  = { bold: true, size: 10, color: { argb: C_WHITE } };
      titleCell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };
      titleCell.alignment = { horizontal: "left", vertical: "middle", indent: 1 };

      const moyCell = row.getCell(5);
      moyCell.value = `Moyenne : ${session.moyenne}/20`;
      moyCell.font  = { bold: true, size: 9, color: { argb: C_WHITE } };
      moyCell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };
      moyCell.alignment = { horizontal: "right", vertical: "middle" };

      row.height = 22;
      r++;
    }

    // ── En-tête colonnes (identique à ResultatsTableHeader) ───────────────
    {
      const row = sheet.getRow(r);
      applyFill(row, C_HDR_BG);
      const headers = ["UE / EC", "Coef", "EC /20", "EC×Coef", "UE /20", "Résultat"];
      headers.forEach((lbl, i) => {
        const c = row.getCell(i + 1);
        c.value = lbl;
        c.font  = { bold: true, size: 8, color: { argb: C_HDR_TXT } };
        c.alignment = { horizontal: i === 0 ? "left" : "center", vertical: "middle", indent: i === 0 ? 1 : 0 };
      });
      applyBorder(row);
      row.height = 16;
      r++;
    }

    // ── UE / EC ────────────────────────────────────────────────────────────
    for (const ue of session.notesListes) {

      // Ligne UE header (bg-indigo-100, texte indigo-900 bold)
      sheet.mergeCells(r, 1, r, COL_COUNT);
      const ueRow = sheet.getRow(r);
      ueRow.getCell(1).value = ue.ue;
      ueRow.getCell(1).font  = { bold: true, size: 9, color: { argb: C_UE_TEXT } };
      ueRow.getCell(1).fill  = { type: "pattern", pattern: "solid", fgColor: { argb: C_UE_BG } };
      ueRow.getCell(1).alignment = { horizontal: "left", vertical: "middle", indent: 1 };
      applyBorder(ueRow);
      ueRow.height = 18;
      r++;

      // Lignes EC
      for (const ec of ue.notes) {
        const ecRow = sheet.getRow(r);
        applyFill(ecRow, C_WHITE);
        cell(ecRow, 1, ec.matiere,             { align: "left", indent: 2 });
        cell(ecRow, 2, ec.coefficient,         { align: "center" });
        cell(ecRow, 3, ec.note,                { bold: true });
        cell(ecRow, 4, ec.noteAvecCoefficient, {});
        cell(ecRow, 5, "—",                    {});
        cell(ecRow, 6, "—",                    {});
        applyBorder(ecRow);
        ecRow.height = 16;
        r++;
      }

      // Ligne TOTAL (bg-slate-100)
      const totRow = sheet.getRow(r);
      applyFill(totRow, C_TOTAL_BG);
      cell(totRow, 1, "Total",                      { bold: true, align: "left", indent: 2 });
      cell(totRow, 2, ue.sommeCoefficients,          { bold: true });
      cell(totRow, 3, "—",                           {});
      cell(totRow, 4, ue.sommeNotesAvecCoefficient,  { bold: true });
      cell(totRow, 5, ue.moyenne, {
        bold: true, size: 10,
        color: ue.isValid ? C_GREEN : C_RED,
      });
      cell(totRow, 6, ue.isValid ? "UE validée" : "Non validée", {
        bold: true,
        color: ue.isValid ? C_GREEN : C_RED,
      });
      applyBorder(totRow);
      totRow.height = 18;
      r++;
    }

    // Ligne vide entre sessions
    r++;
  }

  // ── Téléchargement ─────────────────────────────────────────────────────────
  const buffer = await workbook.xlsx.writeBuffer();
  const blob   = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `releve_${etudiant.nom}_${etudiant.prenom}_${semestreName}.xlsx`);
}
