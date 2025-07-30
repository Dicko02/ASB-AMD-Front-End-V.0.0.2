import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // correction ici : on importe le plugin sans récupération de variable

//Exportation des données du tableau de bord en CSV composé de 3 sections : Statistiques globales, Répartition en %, Évolution mensuelle
function exportDashboardCSV(
  { stats, percentages, monthly },
  baseName = 'dashboard-info',
) {
  if (!stats || !percentages || !monthly) return;

  // Section "Statistiques(pivot → metric,value)"
  const statsCsv = Papa.unparse(
    Object.entries(stats).map(([k, v]) => ({ metric: k, value: v })),
    { header: true, delimiter: ';' },
  );

  // Section "Répartition(%)"
  const pctCsv = Papa.unparse(
    Object.entries(percentages).map(([k, v]) => ({ level: k, percentage: v })),
    { header: true, delimiter: ';' },
  );

  // Section "Évolution mensuelle"
  const monthlyCsv = Papa.unparse(monthly, {
    header: true,
    delimiter: ';',
  });

  // Fusion des blocs avec des séparateurs lisibles
  const fullCsv =
    '#STATISTIQUES\n' +
    statsCsv +
    '\n\n#REPARTITION(%)\n' +
    pctCsv +
    '\n\n#EVOLUTION_MENSUELLE\n' +
    monthlyCsv;

  saveAs(
    new Blob([fullCsv], { type: 'text/csv;charset=utf-8' }),
    `${baseName}.csv`,
  );
}



//Exportation des mêmes données en PDF
function exportDashboardPDF(
  { stats, percentages, monthly },
  baseName = 'dashboard-info',
) {
  if (!stats || !percentages || !monthly) return;

  // Préparation des tables
  const statsBody = Object.entries(stats).map(([k, v]) => [k, v]);
  const pctBody   = Object.entries(percentages).map(([k, v]) => [k, v + '%']);
  const monthlyCols = Object.keys(monthly[0] ?? {});
  const monthlyBody = monthly.map((row) => monthlyCols.map((c) => row[c]));

  // Création du PDF
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  doc.setFontSize(18);
  doc.text('Tableau de bord', 40, 40);

  //Table 1 : Statistiques globales
  doc.autoTable({
    startY: 70,
    head  : [['Métrique', 'Valeur']],
    body  : statsBody,
    theme : 'striped',
    styles: { fontSize: 9 },
    margin: { left: 40, right: 40 },
  });

  //Table 2 : Répartition en %
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 30,
    head  : [['Criticité', 'Pourcentage']],
    body  : pctBody,
    theme : 'striped',
    styles: { fontSize: 9 },
    margin: { left: 40, right: 40 },
  });

  // Table 3 : Évolution mensuelle
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 30,
    head  : [monthlyCols],
    body  : monthlyBody,
    theme : 'striped',
    styles: { fontSize: 8 },
    margin: { left: 40, right: 40 },
  });

  doc.save(`${baseName}.pdf`);
}

export { exportDashboardCSV, exportDashboardPDF };
