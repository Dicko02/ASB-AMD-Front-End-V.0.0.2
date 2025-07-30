import Papa from 'papaparse';
import { saveAs } from 'file-saver';


function exporteCSV(data, baseName) {

  // Normaliser en tableau
  const rows = Array.isArray(data) ? data : [data];
  if (!rows.length) return;

  // enlever _id et __v puis gérer la clé unique
  const sanitized = rows.map((row) => {
    const { _id, __v, CN, Nom, ...rest } = row; // supprime _id & __v
    const rowKey = row?.CN ?? Nom ?? ''; // CN prioritaire sinon Nom

    return { Nom: rowKey, ...rest }; // nouvelle colonne
  });

  // Génération du CSV
  const csv = Papa.unparse(sanitized, {
    header   : true,  // Inclure les noms de colonnes
    delimiter: ';',   // Séparateur
    // quoteChar: '"', // Caractère d’encadrement facultatif
    // newline : '\r\n'// Fin de ligne personnalisée
  });

  // Création du fichier et téléchargement
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `${baseName}.csv`);

}

export default exporteCSV;
