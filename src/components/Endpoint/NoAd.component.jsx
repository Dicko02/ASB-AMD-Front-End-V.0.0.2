import * as React from 'react';
import Loading from '../Complements/Loading.component';
import fetchNoAD from '../../api/noAdAPI/allNoAD.api'; // API pour récupérer les endpoints noAD
import exporteCSV from '../../utils/Export/ExportCSV';
import { exportePDFNoAD } from '../../utils/Export/ExportPDF';

function NoADEndpointsList() {
  const [endpoints, setEndpoints] = React.useState([]); // Liste des endpoints noAD
  const [loading, setLoading] = React.useState(true);   // État de chargement
  const [openDetails, setOpenDetails] = React.useState({}); // Détails ouverts

  const toggleDetail = (id) => {
    setOpenDetails((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Chargement initial
  React.useEffect(() => {
    async function chargerEndpoints() {
      try {
        const response = await fetchNoAD();
        setEndpoints(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des endpoints noAD : ", error);
      } finally {
        setLoading(false);
      }
    }

    chargerEndpoints();
  }, []);

  if (loading) {
    return <Loading text="Chargement de la liste des endpoints noAD..." />;
  }

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
    <div className="p-6 space-y-6">
      {/* Boutons d'export */}
      <div className="flex justify-end gap-3">
        <button
            onClick={() => exporteCSV(endpoints, 'Liste des endpoints noAD')}
            style={{
                backgroundColor: '#f3f4f6',
                border: '1px solid #ccc',
                borderRadius: '6px',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
                display: isVisibleADOrSA ? 'block' : 'none'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e5e7eb'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f3f4f6'}
        >
          Export CSV
        </button>

        <button
            onClick={() => exportePDFNoAD(endpoints, 'Liste des endpoints noAD.pdf')}
            style={{
                backgroundColor: '#f3f4f6',
                border: '1px solid #ccc',
                borderRadius: '6px',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
                display: isVisibleADOrSA ? 'block' : 'none'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e5e7eb'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f3f4f6'}
        >
          Export PDF
        </button>
      </div>

      {/* Liste des endpoints */}
      {endpoints.map((endpoint) => {
        const isOpen = openDetails[endpoint._id];
        const lastUpdate = endpoint.updatedAt ? new Date(endpoint.updatedAt) : new Date();
        const formattedDate = lastUpdate.toLocaleDateString('fr-FR') + ' à ' + lastUpdate.toLocaleTimeString('fr-FR');

        return (
          <div key={endpoint._id} className="border rounded-lg p-4 shadow-sm bg-white">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div className="text-left space-y-1">
                <p><strong>Nom de l'endpoint :</strong> {endpoint.Nom ?? 'Inconnu'}</p>
                <p><strong>Nom de l'utilisateur :</strong> {endpoint.Utilisateur ?? 'Inconnu'}</p>
                <p><strong>Lieu :</strong> {endpoint.Lieu ?? 'Inconnu'}</p>
                <p><strong>Mis à jour le :</strong> {formattedDate ?? 'Inconnu'}</p>
              </div>

              <button
                onClick={() => toggleDetail(endpoint._id)}
                className="mt-3 sm:mt-0 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
              >
                {isOpen ? 'Fermer détail' : 'Voir détail'}
              </button>
            </div>

            {/* Détails étendus */}
            {isOpen && (
              <div className="mt-4 border-t pt-4 text-sm text-gray-700 space-y-1">
                <p><strong>Antivirus :</strong> {endpoint.AntivirusNom ?? 'Inconnu'} (v{endpoint.AntivirusVersion ?? 'Inconnu'}) — Actif : {endpoint.AntivirusActif ?? 'Inconnu'}</p>
                <p><strong>Protection en temps réel :</strong> {endpoint.protectionTempsReel ?? 'Inconnu'}</p>
                <p><strong>Système :</strong> {endpoint.OperatingSystem ?? 'Inconnu'} — Version : {endpoint.OperatingSystemVersion || 'N/A'}</p>
                <p><strong>Volumes libres :</strong> {endpoint.VolumesPourcentageLibre ?? 'Inconnu'}</p>
                <p><strong>État de chiffrement du disque :</strong> {endpoint.etatChiffrement ?? 'Inconnu'}</p>
                <p><strong>Composants :</strong> {endpoint.Composites?.join(', ') || 'Aucun'}</p>
                <p><strong>Date de création :</strong> {new Date(endpoint.createdAt).toLocaleDateString('fr-FR') ?? 'Inconnu'}</p>
                <p><strong>Dernière analyse complète :</strong> {new Date(endpoint.DerniereAnalyseComplete).toLocaleDateString('fr-FR') ?? 'Inconnu'}</p>
                <p><strong>Dernière mise à jour des bases antivirus :</strong> {new Date(endpoint.DerniereMiseAJourBasesAntivirus).toLocaleDateString('fr-FR') ?? 'Inconnu'}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default NoADEndpointsList;
