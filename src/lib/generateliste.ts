import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Remplacez cette chaîne par le Base64 réel de votre logo
const LOGO_BASE64 = "/espa-logo.png";

export const generateStudentPDF = (data: any[], mention: string, niveau: string, parcours: string = "", shouldSave: boolean = true) => {
  const doc = new jsPDF();

  // --- 1. LOGO ET EN-TÊTE ---
  try {
    doc.addImage(LOGO_BASE64, 'PNG', 15, 10, 25, 25);
  } catch (e) {
    console.error("Erreur lors de l'ajout du logo au PDF", e);
  }

  // --- 2. TEXTE DE L'EN-TÊTE ---
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  const textX = 45;
  doc.text("UNIVERSITE D'ANTANANARIVO", textX, 15);
  doc.text("ECOLE SUPERIEURE POLYTECHNIQUE", textX, 20);
  doc.text("D'ANTANANARIVO", textX, 25);
  doc.text("--------------ooOoo--------------", textX, 30);

  doc.setFontSize(10);
  doc.text("Année Universitaire 2025/2026", 140, 15);

  // --- 3. TITRE PRINCIPAL ---
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("FICHE DE PRÉSENCE / LISTE D'ÉMARGEMENT", 105, 48, { align: "center" });

  doc.setFontSize(10);
  doc.text(`MENTION : ${mention.toUpperCase() || "TOUTES"}`, 105, 56, { align: "center" });
  if (niveau) {
    doc.text(`NIVEAU : ${niveau.toUpperCase()}`, 105, 62, { align: "center" });
  }
  if (parcours) {
    doc.text(`PARCOURS : ${parcours.toUpperCase()}`, 105, 68, { align: "center" });
  }

  // --- 4. TABLEAU DES DONNÉES ---
  const tableRows = data.map((et) => [
    et.formation?.matricule || et.matricule || "-",
    `${(et.identite?.nom || et.nom || "").toUpperCase()} ${et.identite?.prenom || et.prenom || ""}`,
    "", // Emargement 1
    "", // Emargement 2
    "", // Emargement 3
    "", // Emargement 4
  ]);

  autoTable(doc, {
    startY: parcours ? 76 : 70,
    head: [['MATRICULE', 'NOM ET PRENOMS', 'EMARGEMENT', 'EMARGEMENT', 'EMARGEMENT', 'EMARGEMENT']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      halign: 'center',
      lineWidth: 0.1,
      fontSize: 7
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [0, 0, 0],
      lineWidth: 0.1,
      minCellHeight: 10
    },
    columnStyles: {
      0: { cellWidth: 25, halign: 'center' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 22, halign: 'center' },
      3: { cellWidth: 22, halign: 'center' },
      4: { cellWidth: 22, halign: 'center' },
      5: { cellWidth: 22, halign: 'center' },
    },
    styles: {
      font: "helvetica",
      lineColor: [0, 0, 0],
      valign: 'middle'
    }
  });

  // --- 5. BAS DE PAGE ET SIGNATURE ---
  const finalY = (doc as any).lastAutoTable.finalY + 10;

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(`TOTAL : ${data.length} ÉTUDIANT(S).`, 15, finalY);

  const signatureY = finalY + 10;
  doc.setFont("helvetica", "bold");
  doc.text("Le Responsable,", 145, signatureY + 8);

  doc.setLineWidth(0.2);
  doc.line(135, signatureY + 25, 185, signatureY + 25);

  if (shouldSave) {
    doc.save(`Fiche_Presence_${mention.replace(/\s+/g, '_')}.pdf`);
  }
  return doc;
};