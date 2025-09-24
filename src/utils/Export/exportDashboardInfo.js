import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // correction ici : on importe le plugin sans récupération de variable

//Exportation des données du tableau de bord en CSV composé de 3 sections : Statistiques globales, Répartition en %, Évolution mensuelle
function exportDashboardCSV(
  { stats, NoComposantStats, percentages, monthly, topEndpoints },
  baseName = 'dashboard-info',
) {
  if (!stats || !percentages || !monthly || !topEndpoints) return;

  // Section "Statistiques(pivot → metric,value)"
  const statsCsv = Papa.unparse(
    Object.entries(stats).map(([k, v]) => ({ metric: k, value: v })),
    { header: true, delimiter: ';' },
  );

  // Section "Statistiques(pivot → metric,value)"
  const NoComposantStatsCsv = Papa.unparse(
    Object.entries(NoComposantStats).map(([k, v]) => ({ metric: k, value: v })),
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

  // Section Top 5 endpoints critiques
  const topCsv = Papa.unparse(
    (topEndpoints || []).map(ep => ({
      endpoint: ep.CN || ep.Nom,
      criticalLevel: ep.criticalLevel,
      dangerousityNumber: ep.dangerousityNumber,
      jours: ep.jours,
    })),
    { header: true, delimiter: ';' },
  );

  // Fusion des blocs avec des séparateurs lisibles
  const fullCsv =
    '#STATISTIQUES\n' +
    statsCsv +
    '\n\n#NO-COMPOSANTS_STATISTIQUES\n' +
    NoComposantStatsCsv +
    '\n\n#REPARTITION(%)\n' +
    pctCsv +
    '\n\n#EVOLUTION_MENSUELLE\n' +
    monthlyCsv +
    '\n\n#TOP5_ENDPOINTS_CRITIQUES\n' +
    topCsv;

  saveAs(
    new Blob([fullCsv],
    { type: 'text/csv;charset=utf-8' }),
    `${baseName}.csv`,
  );
}



//Exportation des mêmes données en PDF
function exportDashboardPDF(
  { stats, NoComposantStats, percentages, monthly, topEndpoints },
  baseName = 'dashboard-info',
) {
  if (!stats || !NoComposantStats || !percentages || !monthly || !topEndpoints) return;

  // Préparation des tables
  const statsBody = Object.entries(stats).map(([k, v]) => [k, v]);
  const NoComposantStatsBody = Object.entries(NoComposantStats).map(([k, v]) => [k, v]);
  const pctBody   = Object.entries(percentages).map(([k, v]) => [k, v + '%']);
  const monthlyCols = Object.keys(monthly[0] ?? {});
  const monthlyBody = monthly.map((row) => monthlyCols.map((c) => row[c]));

  // Table Top 5
  const topCols = ['Endpoint', 'Critical Level', 'Dangerousity', 'Jours'];
  const topBody = (topEndpoints || []).map(ep => [
    ep.CN || ep.Nom,
    ep.criticalLevel,
    ep.dangerousityNumber,
    ep.jours,
  ]);

  // Création du PDF
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  doc.setFontSize(18);
  doc.text('Tableau de bord', 40, 40);

  //Table 1.1 : Statistiques globales
  autoTable(doc, {
    startY: 70,
    head  : [['Métrique', 'Valeur']],
    body  : statsBody,
    theme : 'striped',
    styles: { fontSize: 9 },
    margin: { left: 40, right: 40 },
  });

  //Table 1.2 : Statistiques globales(No-Composites)
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 40,
    head  : [['Métrique', 'Valeur']],
    body  : NoComposantStatsBody,
    theme : 'striped',
    styles: { fontSize: 9 },
    margin: { left: 40, right: 40 },
  });

  //Table 2 : Répartition en %
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 40,
    head  : [['Criticité', 'Pourcentage']],
    body  : pctBody,
    theme : 'striped',
    styles: { fontSize: 9 },
    margin: { left: 40, right: 40 },
  });

  // Table 3 : Évolution mensuelle
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 40,
    head  : [monthlyCols],
    body  : monthlyBody,
    theme : 'striped',
    styles: { fontSize: 8 },
    margin: { left: 40, right: 40 },
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 40,
    head: [topCols],
    body: topBody,
    theme: 'striped',
    styles: { fontSize: 9 },
    margin: { left: 40, right: 40 }
  });

  doc.save(`${baseName}.pdf`);
}

export { exportDashboardCSV, exportDashboardPDF };
