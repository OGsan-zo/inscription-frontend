import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import type { EtudiantRecherche, ResultatEtudiant, NoteUE } from "../types/notes";

// ─────────────────────────────────────────────────────────────────────────────

export interface GenererReleveParams {
  etudiant: EtudiantRecherche;
  semestreName: string;
  anneeUniversitaire?: string;
  resultat: ResultatEtudiant;
}

// ── Chemins des logos (à modifier si besoin) ──────────────────────────────────
const LOGO_GAUCHE = "/espaLogo.jpeg";
const LOGO_DROIT  = "/espa-logo.png";

// ── Couleurs ARGB (palette neutre) ────────────────────────────────────────────
const C_BLUE_HDR  = "FF4472C4"; // En-tête Session Normale (bleu Excel standard)
const C_AMBER_HDR = "FFB8860B"; // En-tête Session Rattrapage
const C_DARK_HDR  = "FF595959"; // En-tête général
const C_TOTAL_BG  = "FFF2F2F2"; // Fond ligne TOTAL (très léger)
const C_WHITE     = "FFFFFFFF";
const C_GREEN     = "FF375623";
const C_RED       = "FF9C0006";
const C_TITLE     = "FF8B0000"; // Rouge foncé — institution / titre
const C_UE_TEXT   = "FF1F3864"; // Bleu nuit — texte ligne UE

const COL_COUNT = 11; // A → K

// ── Helpers ───────────────────────────────────────────────────────────────────

type BorderStyle = "thin" | "medium";

function applyBorder(
  row: ExcelJS.Row,
  cols: number = COL_COUNT,
  style: BorderStyle = "thin"
) {
  for (let c = 1; c <= cols; c++) {
    row.getCell(c).border = {
      top:    { style, color: { argb: "FFBBBBBB" } },
      left:   { style, color: { argb: "FFBBBBBB" } },
      bottom: { style, color: { argb: "FFBBBBBB" } },
      right:  { style, color: { argb: "FFBBBBBB" } },
    };
  }
}

function applyFill(row: ExcelJS.Row, argb: string, cols: number = COL_COUNT) {
  for (let c = 1; c <= cols; c++) {
    row.getCell(c).fill = {
      type: "pattern", pattern: "solid", fgColor: { argb },
    };
  }
}

function cell(
  row: ExcelJS.Row,
  col: number,
  value: string | number,
  opts: {
    bold?: boolean;
    size?: number;
    color?: string;
    align?: ExcelJS.Alignment["horizontal"];
    indent?: number;
    italic?: boolean;
    underline?: boolean;
  } = {}
) {
  const c = row.getCell(col);
  c.value = value;
  c.font = {
    bold:      opts.bold      ?? false,
    size:      opts.size      ?? 9,
    italic:    opts.italic    ?? false,
    underline: opts.underline ?? false,
    color: { argb: opts.color ?? "FF000000" },
  };
  c.alignment = {
    horizontal: opts.align  ?? "center",
    vertical:   "middle",
    indent:     opts.indent ?? 0,
    wrapText:   true,
  };
}

function headerCell(
  row: ExcelJS.Row,
  col: number,
  value: string,
  fillArgb: string
) {
  const c = row.getCell(col);
  c.value = value;
  c.font  = { bold: true, size: 8.5, color: { argb: C_WHITE } };
  c.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: fillArgb } };
  c.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
  c.border = {
    top:    { style: "medium", color: { argb: "FF444444" } },
    left:   { style: "medium", color: { argb: "FF444444" } },
    bottom: { style: "medium", color: { argb: "FF444444" } },
    right:  { style: "medium", color: { argb: "FF444444" } },
  };
}

// ── Chargement logo (silencieux si absent) ────────────────────────────────────

async function fetchBuffer(path: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(path);
    if (!res.ok) return null;
    return res.arrayBuffer();
  } catch {
    return null;
  }
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

  // ── Largeurs des colonnes ──────────────────────────────────────────────────
  sheet.columns = [
    { width: 42 }, // A – UE / EC
    { width: 13 }, // B – Coefficient
    { width: 10 }, // C – Crédit
    { width: 10 }, // D – N: EC/20
    { width: 14 }, // E – N: EC×Coef
    { width: 10 }, // F – N: UE/20
    { width: 16 }, // G – N: Résultat
    { width: 10 }, // H – R: EC/20
    { width: 14 }, // I – R: EC×Coef
    { width: 10 }, // J – R: UE/20
    { width: 16 }, // K – R: Résultat
  ];

  let r = 1;

  // ── Helper : ligne fusionnée (toute la largeur) ────────────────────────────
  const mergeRow = (text: string, opts: {
    bold?: boolean; size?: number; color?: string;
    fill?: string; italic?: boolean; height?: number; underline?: boolean;
  } = {}) => {
    sheet.mergeCells(r, 1, r, COL_COUNT);
    const row = sheet.getRow(r);
    row.getCell(1).value = text;
    row.getCell(1).font  = {
      bold:      opts.bold      ?? false,
      size:      opts.size      ?? 10,
      italic:    opts.italic    ?? false,
      underline: opts.underline ?? false,
      color: { argb: opts.color ?? "FF000000" },
    };
    row.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
    if (opts.fill) {
      row.getCell(1).fill = {
        type: "pattern", pattern: "solid", fgColor: { argb: opts.fill },
      };
    }
    row.height = opts.height ?? 16;
    r++;
  };

  // ── En-tête institution (6 lignes → espace pour les logos) ────────────────
  mergeRow("UNIVERSITE D'ANTANANARIVO",
    { bold: true, size: 13, color: C_TITLE, underline: true, height: 22 });
  mergeRow("ECOLE SUPERIEURE POLYTECHNIQUE D'ANTANANARIVO",
    { bold: true, size: 11, color: C_TITLE, underline: true, height: 18 });
  mergeRow("Domaine : SCIENCE DE L'INGENIEUR", { size: 10, height: 16 });
  mergeRow(`Mention : ${etudiant.mention ?? ""}`, { size: 10, height: 16 });
  mergeRow(`Parcours :`, { size: 10, height: 16 });
  mergeRow(`Niveau : ${etudiant.niveau ?? ""}`,   { size: 10, height: 16 });

  // ── Insertion des logos (ils flottent sur les 6 premières lignes) ──────────
  const LOGO_ROWS = 6; // lignes d'en-tête réservées aux logos
  if (leftBuf) {
    const ext = LOGO_GAUCHE.endsWith(".png") ? "png" : "jpeg";
    const id = workbook.addImage({ buffer: leftBuf, extension: ext as "png" | "jpeg" });
    sheet.addImage(id, {
      tl: { col: 0,  row: 0 },
      br: { col: 3,  row: LOGO_ROWS },
    } as ExcelJS.ImageRange);
  }
  if (rightBuf) {
    const ext = LOGO_DROIT.endsWith(".png") ? "png" : "jpeg";
    const id = workbook.addImage({ buffer: rightBuf, extension: ext as "png" | "jpeg" });
    sheet.addImage(id, {
      tl: { col: 8,  row: 0 },
      br: { col: 11, row: LOGO_ROWS },
    } as ExcelJS.ImageRange);
  }

  mergeRow("", { height: 6 });

  // ── Titre ──────────────────────────────────────────────────────────────────
  mergeRow(
    `RELEVE DES NOTES DE L'ETUDIANT ET RESULTATS DU SEMESTRE ${semestreName}`,
    { bold: true, size: 12, color: C_TITLE, height: 22 }
  );
  mergeRow(`Année Universitaire : ${anneeUniversitaire}`,
    { italic: true, size: 10 });
  mergeRow("", { height: 6 });

  // ── Infos étudiant ─────────────────────────────────────────────────────────
  {
    const row = sheet.getRow(r);
    cell(row, 1, `Nom : ${etudiant.nom}`,      { bold: true, align: "left", indent: 1 });
    cell(row, 6, `Prénom : ${etudiant.prenom}`, { bold: true, align: "left" });
    row.height = 16;
    r++;
  }
  {
    const row = sheet.getRow(r);
    cell(row, 1, "Né le : ",                       { bold: true, align: "left", indent: 1 });
    cell(row, 6, `N° Inscription : ${etudiant.id}`, { bold: true, align: "left" });
    row.height = 16;
    r++;
  }
  mergeRow("", { height: 6 });

  // ── En-tête du tableau (double ligne) ─────────────────────────────────────

  const hRow1 = sheet.getRow(r);
  hRow1.height = 28;

  headerCell(hRow1, 1, "UE: Unité d'Enseignement\nEC: Éléments Constitutifs", C_DARK_HDR);
  headerCell(hRow1, 2, "Coefficient", C_DARK_HDR);
  headerCell(hRow1, 3, "Crédit",      C_DARK_HDR);
  headerCell(hRow1, 4, "SESSION NORMALE",       C_BLUE_HDR);
  headerCell(hRow1, 8, "SESSION DE RATTRAPAGE", C_AMBER_HDR);

  sheet.mergeCells(r, 4, r, 7);   // D–G : Session Normale
  sheet.mergeCells(r, 8, r, 11);  // H–K : Session Rattrapage
  sheet.mergeCells(r, 1, r + 1, 1);
  sheet.mergeCells(r, 2, r + 1, 2);
  sheet.mergeCells(r, 3, r + 1, 3);
  r++;

  const hRow2 = sheet.getRow(r);
  hRow2.height = 16;
  ["EC/20", "EC avec coef", "UE/20", "Résultat"].forEach((lbl, i) => {
    headerCell(hRow2, 4 + i, lbl, C_BLUE_HDR);
  });
  ["EC/20", "EC avec coef", "UE/20", "Résultat"].forEach((lbl, i) => {
    headerCell(hRow2, 8 + i, lbl, C_AMBER_HDR);
  });
  r++;

  // ── Données UE / EC ────────────────────────────────────────────────────────

  const sessionNormale    = resultat.find((s) => s.type === "Normale");
  const sessionRattrapage = resultat.find((s) => s.type === "Rattrapage");
  const uesRef: NoteUE[]  =
    sessionNormale?.notesListes ?? sessionRattrapage?.notesListes ?? [];

  for (const ue of uesRef) {
    const ueR = sessionRattrapage?.notesListes.find((u) => u.ue === ue.ue);

    // ── Ligne UE (texte bold, sans fond coloré) ────────────────────────────
    sheet.mergeCells(r, 1, r, COL_COUNT);
    const ueRow = sheet.getRow(r);
    ueRow.getCell(1).value = ue.ue;
    ueRow.getCell(1).font  = { bold: true, size: 9.5, color: { argb: C_UE_TEXT } };
    ueRow.getCell(1).fill  = { type: "pattern", pattern: "solid", fgColor: { argb: C_WHITE } };
    ueRow.getCell(1).alignment = { horizontal: "left", vertical: "middle", indent: 1 };
    applyBorder(ueRow);
    ueRow.height = 18;
    r++;

    // ── Lignes EC ─────────────────────────────────────────────────────────
    for (let i = 0; i < ue.notes.length; i++) {
      const ec  = ue.notes[i];
      const ecR = ueR?.notes[i];

      const ecRow = sheet.getRow(r);
      applyFill(ecRow, C_WHITE);
      cell(ecRow, 1, ec.matiere,             { align: "left", indent: 2 });
      cell(ecRow, 2, ec.coefficient,         {});
      cell(ecRow, 3, "—",                    {});
      cell(ecRow, 4, ec.note,                { bold: true });
      cell(ecRow, 5, ec.noteAvecCoefficient, {});
      cell(ecRow, 6, "—",                    {});
      cell(ecRow, 7, "—",                    {});
      cell(ecRow, 8,  ecR ? ecR.note               : "—", { bold: !!ecR });
      cell(ecRow, 9,  ecR ? ecR.noteAvecCoefficient : "—", {});
      cell(ecRow, 10, "—",                   {});
      cell(ecRow, 11, "—",                   {});
      applyBorder(ecRow);
      ecRow.height = 16;
      r++;
    }

    // ── Ligne TOTAL ────────────────────────────────────────────────────────
    const totRow = sheet.getRow(r);
    applyFill(totRow, C_TOTAL_BG);

    cell(totRow, 1, "TOTAL",               { bold: true, align: "left", indent: 2 });
    cell(totRow, 2, ue.sommeCoefficients,  { bold: true });
    cell(totRow, 3, "—",                   {});
    cell(totRow, 4, "—",                   {});
    cell(totRow, 5, ue.sommeNotesAvecCoefficient, { bold: true });
    cell(totRow, 6, ue.moyenne, {
      bold: true, color: ue.isValid ? C_GREEN : C_RED,
    });
    cell(totRow, 7, ue.isValid ? "UE validée" : "Non validée", {
      bold: true, color: ue.isValid ? C_GREEN : C_RED,
    });

    if (ueR) {
      cell(totRow, 8,  "—",                           {});
      cell(totRow, 9,  ueR.sommeNotesAvecCoefficient, { bold: true });
      cell(totRow, 10, ueR.moyenne, {
        bold: true, color: ueR.isValid ? C_GREEN : C_RED,
      });
      cell(totRow, 11, ueR.isValid ? "UE validée" : "Non validée", {
        bold: true, color: ueR.isValid ? C_GREEN : C_RED,
      });
    } else {
      [8, 9, 10, 11].forEach((c) => cell(totRow, c, "—", {}));
    }

    applyBorder(totRow);
    totRow.height = 18;
    r++;
  }

  // ── Résumé semestriel ──────────────────────────────────────────────────────
  r++;

  sheet.mergeCells(r, 1, r, COL_COUNT);
  const resTitleRow = sheet.getRow(r);
  resTitleRow.getCell(1).value = `RESULTAT PARTIEL DU SEMESTRE ${semestreName}`;
  resTitleRow.getCell(1).font  = { bold: true, size: 10, color: { argb: C_WHITE } };
  resTitleRow.getCell(1).fill  = { type: "pattern", pattern: "solid", fgColor: { argb: C_DARK_HDR } };
  resTitleRow.getCell(1).alignment = { horizontal: "left", vertical: "middle", indent: 1 };
  applyBorder(resTitleRow);
  resTitleRow.height = 20;
  r++;

  const resHRow = sheet.getRow(r);
  sheet.mergeCells(r, 1, r, 3);
  sheet.mergeCells(r, 4, r, 7);
  sheet.mergeCells(r, 8, r, 11);
  headerCell(resHRow, 1, "",                     C_DARK_HDR);
  headerCell(resHRow, 4, "SESSION NORMALE",       C_BLUE_HDR);
  headerCell(resHRow, 8, "SESSION DE RATTRAPAGE", C_AMBER_HDR);
  resHRow.height = 18;
  r++;

  const summaryData: [string, string, string][] = [
    ["Nombre total des crédits des UE", "30", "30"],
    ["Nombre des crédits acquis",        "—",  "—"],
    [
      "Moyenne semestrielle",
      sessionNormale    ? String(sessionNormale.moyenne)    : "—",
      sessionRattrapage ? String(sessionRattrapage.moyenne) : "—",
    ],
    ["Résultat", "—", "—"],
  ];

  for (const [label, normal, rattrapage] of summaryData) {
    const row = sheet.getRow(r);
    sheet.mergeCells(r, 1, r, 3);
    sheet.mergeCells(r, 4, r, 7);
    sheet.mergeCells(r, 8, r, 11);

    applyFill(row, "FFF8F8F8");
    cell(row, 1, label,      { bold: true, align: "left", indent: 1 });
    cell(row, 4, normal,     { align: "center" });
    cell(row, 8, rattrapage, { align: "center" });

    applyBorder(row);
    row.height = 18;
    r++;
  }

  // ── Téléchargement ─────────────────────────────────────────────────────────
  const buffer = await workbook.xlsx.writeBuffer();
  const blob   = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `releve_${etudiant.nom}_${etudiant.prenom}_${semestreName}.xlsx`);
}
