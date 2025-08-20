import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

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



async function exportePDFDetailEndpoint(elementId, nomFichier = 'detail-endpoint') {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Élément avec l'ID "${elementId}" introuvable`);
    return;
  }

  try {
    console.log('elementId: ', elementId);
    console.log('element: ', element);
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let position = 0;

    if (imgHeight < pageHeight) {
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    } else {
      // Gérer contenu qui dépasse une page
      let remainingHeight = imgHeight;
      let y = 0;

      while (remainingHeight > 0) {
        pdf.addImage(imgData, 'PNG', 0, y, imgWidth, imgHeight);
        remainingHeight -= pageHeight;
        if (remainingHeight > 0) {
          pdf.addPage();
          y -= pageHeight;
        }
      }
    }

    pdf.save(nomFichier);
  } catch (err) {
    console.error("Erreur lors de l'export PDF :", err);
  }
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
