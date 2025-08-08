import Papa from 'papaparse';
import { saveAs } from 'file-saver';

function exporteCSV(data, baseName) {
  const rows = Array.isArray(data) ? data : [data];
  if (!rows.length) return;

  const sanitized = rows.map((row) => {
    const { _id, __v, ...rest } = row; // on garde tout sauf MongoDB internals
    return rest; // pas besoin de renommer CN/Nom ici
  });

  const csv = Papa.unparse(sanitized, {
    header: true,
    delimiter: ';',
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `${baseName}.csv`);
}

export default exporteCSV;
