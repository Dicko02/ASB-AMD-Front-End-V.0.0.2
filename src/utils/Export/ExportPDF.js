import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function exportePDFListeEndpoints(data, baseName = 'liste-endpoints') {
  const rows = Array.isArray(data) ? data : [data];
  if (!rows.length) return;

  // Colonnes visibles dans le tableau React (filtrées)
  const visibleColumns = [
    'CN',
    'Utilisateur',
    'Lieu',
    'dangerousityNumber',
    'criticalLevel',
    'updatedAt',
  ];

  // Préparer données pour pdf, en conservant l'ordre des colonnes visibles
  const sanitized = rows.map(row => {
    const { _id, __v, ...rest } = row;
    // Fixe une clé visible CN
    const rowKey = row?.CN ?? row?._id ?? '';
    return { CN: rowKey, ...rest };
  });

  // Préparer head et body en respectant visibleColumns
  const columns = visibleColumns;
  const body = sanitized.map(r =>
    columns.map(c => {
      let val = r[c];

      // Pour updatedAt, formater la date proprement si présente
      if (c === 'updatedAt') {
        if (val) {
          const d = new Date(val);
          val = isNaN(d.getTime())
            ? ''
            : d.toLocaleDateString('fr-FR') + ' à ' + d.toLocaleTimeString('fr-FR');
        } else {
          val = '';
        }
      }

      // Gérer les tableaux et dates pour lisibilité
      if (Array.isArray(val)) return val.join(', ');
      if (val instanceof Date) return val.toLocaleString();
      return val ?? '';
    })
  );

  const doc = new jsPDF({
    orientation: 'portrait', // plus naturel pour ce genre de tableau vertical
    unit: 'pt',
    format: 'a4',
  });

  // Titre centré
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  const pageWidth = doc.internal.pageSize.getWidth();
  const titleText = `${baseName}`;
  const titleWidth = doc.getTextWidth(titleText);
  doc.text(titleText, (pageWidth - titleWidth) / 2, 40);

  // Table autoTable
  autoTable(doc, {
    head: [columns],
    body,
    startY: 60,
    styles: {
      fontSize: 8, // un peu petit pour tout faire tenir
      cellPadding: 4,
      overflow: 'linebreak', // retour à la ligne dans les cellules trop longues
      valign: 'middle',
      halign: 'left',
      textColor: 40,
      fontStyle: 'normal',
    },
    headStyles: {
      fillColor: [200, 200, 200],
      textColor: 20,
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'center',
      cellPadding: 5,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { left: 30, right: 30, top: 60, bottom: 40 },
    theme: 'grid',
    tableWidth: 'auto',
    columnStyles: {
      CN: { cellWidth: 90, halign: 'center' },
      dangerousityNumber: { cellWidth: 70, halign: 'center' },
      criticalLevel: { cellWidth: 70, halign: 'center' },
      description: { cellWidth: 120 },
      updatedAt: { cellWidth: 120 },
    },
    didDrawPage: () => {
      // Numéro de page en bas à droite, noir et discret
      const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
      doc.setFontSize(8);
      doc.setTextColor(0);
      doc.text(`Page ${pageNumber}`, pageWidth - 40, doc.internal.pageSize.getHeight() - 15);
    },
  });

  doc.save(`${baseName}.pdf`);
}



function exportePDFDetailEndpoint(data, baseName = 'detail-endpoint') {
  if (!data) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  // Titre centré
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  const pageWidth = doc.internal.pageSize.getWidth();
  const titleText = `Détail endpoint – ${baseName}`;
  const titleWidth = doc.getTextWidth(titleText);
  doc.text(titleText, (pageWidth - titleWidth) / 2, 40);

  // Clés à exclure de l'affichage
  const excludeKeys = [
    '_id',
    '__v'
  ];

  // Filtrer les clés à afficher (et trier alphabétiquement pour clarté)
  const keys = Object.keys(data)
    .filter(k => !excludeKeys.includes(k))
    .sort();

  let y = 70; // position de départ verticale
  const lineHeight = 16; // hauteur de ligne
  const keyX = 40;       // marge gauche pour les noms
  const valX = 200;      // marge gauche pour les valeurs (à droite du nom)

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');

  keys.forEach((key) => {
    // Nom de la clé (en gras)
    doc.text(`${key} :`, keyX, y);

    doc.setFont('helvetica', 'normal');

    // Valeur formattée
    let val = data[key];

    if (val === null || val === undefined) val = '';
    else if (Array.isArray(val)) val = val.join(', ');
    else if (val instanceof Date) val = val.toLocaleString();
    else if (typeof val === 'object') val = JSON.stringify(val, null, 2);

    // Gérer les longues valeurs : on fait un split manuel en lignes si trop long
    const maxWidth = pageWidth - valX - 40;
    const splitText = doc.splitTextToSize(val.toString(), maxWidth);

    doc.text(splitText, valX, y);

    // Calculer la hauteur utilisée (nombre de lignes * lineHeight)
    const heightUsed = splitText.length * lineHeight;

    y += Math.max(lineHeight, heightUsed) + 6; // ajoute un espacement de 6 pts

    // Gestion de page si y dépasse la page
    if (y > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      y = 40; // nouvelle page, départ plus bas
    }

    doc.setFont('helvetica', 'bold');
  });

  // Pied de page avec numéro de page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(0);
    doc.text(
      `Page ${i} / ${pageCount}`,
      pageWidth - 60,
      doc.internal.pageSize.getHeight() - 15
    );
  }

  doc.save(`${baseName}.pdf`);
}




function exportePDFNoAD(data, baseName = 'liste-complete-endpoints-noAD') {
  if (!Array.isArray(data) || data.length === 0) return;

  // Colonnes choisies, incluant les détails étendus
  const visibleColumns = [
    'Nom', 'Utilisateur', 'Lieu', 'updatedAt',
    'AntivirusNom', 'AntivirusVersion', 'AntivirusActif',
    'protectionTempsReel', 'OperatingSystem', 'OperatingSystemVersion',
    'VolumesPourcentageLibre', 'etatChiffrement', 'Composites',
    'createdAt', 'DerniereAnalyseComplete', 'DerniereMiseAJourBasesAntivirus'
  ];

  // Préparer les données nettoyées et formatées
  const sanitized = data.map(item => {
    // Supprimer champs _id et __v
    const { _id, __v, ...rest } = item;

    // Formatage spécifique des dates et tableaux
    return {
      ...visibleColumns.reduce((acc, col) => {
        let val = rest[col];
        if (val === null || val === undefined) val = '';
        else if (Array.isArray(val)) val = val.join(', ');
        else if (
          col.toLowerCase().includes('date') ||
          col.toLowerCase().includes('updatedat') ||
          col.toLowerCase().includes('createdat')
        ) {
          const d = new Date(val);
          val = isNaN(d.getTime()) ? '' : d.toLocaleDateString('fr-FR') + ' à ' + d.toLocaleTimeString('fr-FR');
        } else if (typeof val === 'object') {
          val = JSON.stringify(val);
        }
        acc[col] = val;
        return acc;
      }, {})
    };
  });

  const columns = visibleColumns;
  const body = sanitized.map(row => columns.map(col => row[col]));

  const largeur = 1500;  // Largeur en points (pt), plus large qu'A4 paysage
  const hauteur = 850;   // Hauteur standard A4 paysage (en pt)
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: [largeur, hauteur],
  });

  // Titre centré
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  const pageWidth = doc.internal.pageSize.getWidth();
  const titleText = `Liste complète des endpoints noAD`;
  const titleWidth = doc.getTextWidth(titleText);
  doc.text(titleText, (pageWidth - titleWidth) / 2, 40);

  const columnStyles = {};
  columns.forEach((_, index) => {
    columnStyles[index] = { cellWidth: 'wrap' };
  });

  autoTable(doc, {
    head: [columns],
    body,
    columnStyles,
    startY: 60,
    styles: {
      fontSize: 8.5,
      cellPadding: 3,
      overflow: 'linebreak',
      valign: 'middle',
      halign: 'left',
      textColor: 40,
      fontStyle: 'normal',
    },
    headStyles: {
      fillColor: [200, 200, 200],
      textColor: 20,
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'center',
      cellPadding: 5,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { left: 20, right: 20, top: 60, bottom: 40 },
    theme: 'grid',
    tableWidth: 'auto',
    didDrawPage: () => {
      const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
      doc.setFontSize(8);
      doc.setTextColor(0);
      doc.text(`Page ${pageNumber}`, pageWidth - 40, doc.internal.pageSize.getHeight() - 15);
    },
  });

  doc.save(`${baseName}.pdf`);
}


export {exportePDFDetailEndpoint, exportePDFListeEndpoints, exportePDFNoAD};
