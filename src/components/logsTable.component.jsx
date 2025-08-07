import { useEffect, useState } from "react";
import fetchLogsDownload from "../api/logsAPI/fetchLogsDownload.api";

/*
 * - data (Array) : tableau de chaînes (logs)
 * - title (string)
 * - logType (string) : utilisé pour l'export
 */

function LogsTable({
  data = [],
  title = "Logs",
  logType = "generic",
}) {
  const [logs, setLogs] = useState(Array.isArray(data) ? data : []);
  const [loading, setLoading] = useState(!Array.isArray(data) || data.length === 0);
  const [error, setError] = useState("");

  useEffect(() => {
    const safe = Array.isArray(data) ? data : [];
    setLogs(safe);
    setLoading(false);
  }, [data]);

  const handleExport = async () => {
    try {
      if (typeof fetchLogsDownload === "function") {
        await fetchLogsDownload(logType);
      } else {
        // Export CSV avec une seule colonne "Log"
        const header = "Log";
        const rows = logs.map((l) => `"${String(l).replace(/"/g, '""')}"`);
        const csv = [header, ...rows].join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${logType || "logs"}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Erreur export :", err);
      setError("Erreur lors de l'export.");
    }
  };

  const adminSessionStr = localStorage.getItem('adminSession'); // chaîne JSON
  const adminSession = JSON.parse(adminSessionStr); // maintenant un objet JS
  const titre = adminSession.titre;
  const SA = "Super Admin";
  const AD = "Admin";

  let isVisibleADOrSA = false;
  if(titre === AD || titre === SA){
    isVisibleADOrSA = true;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-5xl mx-auto" style={{backgroundColor: 'black', color: 'white'}}>
      <div className="flex items-center justify-between mb-4">
        <h2 style={{
          fontSize: '30px',
          marginRight: '60%',
          marginLeft: '5%',
          marginTop: '1%'
        }}>{title}</h2>
        <button onClick={handleExport} 
          style={{
            backgroundColor: '#921b88ff',
            border: '1px solid #ccc',
            borderRadius: '6px',
            padding: '0.4rem 0.8rem',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            display: isVisibleADOrSA ? 'block' : 'none'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#081329ff'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#921b88ff'}
        >
          Export {logType}-Logs
        </button>
      </div>

      {loading && <p className="text-blue-500">Chargement des logs...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && Array.isArray(logs) && logs.length > 0 && (
        <div className="overflow-x-auto" style={{marginLeft: '3%'}}>
          <table className="table-auto border-collapse w-full">
            <tbody>
              {logs.map((log, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b whitespace-pre-wrap">{log}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && Array.isArray(logs) && logs.length === 0 && (
        <p className="text-gray-500">Aucun log trouvé.</p>
      )}
    </div>
  );
}

export default LogsTable;
