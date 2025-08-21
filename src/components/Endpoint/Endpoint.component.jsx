import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import fetchEndpoint from '../../api/endpoint/endpoint.api';
import Loading from '../Complements/Loading.component';
import exporteCSV from '../../utils/Export/ExportCSV';
import {exportePDFDetailEndpoint} from '../../utils/Export/ExportPDF';
import critiquesDurablesEndpoint from '../../utils/critiquesDurablesEndpoint'

function Endpoint() {
  const { CN } = useParams();
  const [endpoint, setEndpoint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [critiquesDurables, setCritiquesDurables] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetchEndpoint(CN);
        setEndpoint(response.data);
      } catch (err) {
        setError('Erreur lors du chargement de l\'endpoint.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (CN) {
      loadData();
    }
  }, [CN]);

  useEffect(() => {
    async function fetchCritiques() {
      try {
        if (endpoint?.CN) {
          const data = await critiquesDurablesEndpoint(endpoint.CN);
          setCritiquesDurables(data);
        }
      } catch (err) {
        console.error("Erreur lors de l'analyse des critiques durables", err);
      }
    }

    fetchCritiques();
  }, [endpoint]);


  if (loading){
    return <Loading text="Chargement des details..." />;
  }
  
  if (error){
    return (
      <p
        style={{
          textAlign: 'center',
          color: 'red',
          fontWeight: 'bold',
          marginTop: '50px',
        }}
      >
        {error}
      </p>
    );
  }

  if (!endpoint){
    return (
      <p style={{ textAlign: 'center', fontSize: '18px', marginTop: '50px' }}>
        Aucune donnée trouvée.
      </p>
    );
  }

  function Conforme(){
    let CL = endpoint.criticalLevel?.toLowerCase();
    
    if(CL === 'low'){
      return (<span style={{color: 'green'}}>Conforme</span>)

    }else if(CL === 'medium'){
      return (<span style={{color: 'yellow'}}>Non Conforme</span>)

    }else if(CL === 'high'){
      return (<span style={{color: 'orange'}}>Non Conforme</span>)

    }else if(CL === 'critical'){
      return (<span style={{color: 'red'}}>Non Conforme</span>)
    }
    
  }

  function PourcentageCoherence(){
    let resultV1 = (endpoint.incoherenceNumber * 100)/endpoint.incoherenceTotalScore;
    let resultV2 = 100 - resultV1;
    let arrondi = resultV2.toFixed(2); // retourne une chaîne "3.33"
    //let nombre = parseFloat(arrondi);  // convertit en nombre 3.33 si nécessaire
    return arrondi;
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
    <div
      style={{
        maxWidth: 900,
        margin: '40px auto',
        padding: 20,
        fontFamily: 'Arial, sans-serif',
        lineHeight: 1.6,
        borderRadius: '10px',
      }}
    >
      {/* Boutons Export */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.5rem',
          marginBottom: '20px',
        }}
      >
        <button
          onClick={() => exporteCSV(endpoint, `endpoint-${endpoint.CN || 'unique'}`)}
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
          onClick={() => exportePDFDetailEndpoint(endpoint._id, `endpoint-${endpoint.CN || 'unique'}.pdf`)}
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

      <div id={endpoint._id}>
        {/* Titre de l'endpoint */}
          <h1
            style={{
              textAlign: 'center',
              marginBottom: 30,
              fontSize: '28px',
              color: '#1f2937',
              borderColor: 'black'
            }}
          >
            {endpoint.CN} - {Conforme()}
          </h1>

          {/* Détail de l'endpoint */}
          <div
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              padding: 20,
              marginBottom: 20,
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              backgroundColor: '#fff',
            }}
          >
            <p><strong>Utilisateur :</strong> {endpoint.Utilisateur ?? 'Inconnu'}</p>
            <p><strong>Type de machine :</strong> {endpoint.typeMachine}</p>
            <p><strong>Niveau de dangerosité :</strong> {endpoint.criticalLevel ?? 'Inconnu'} (score : {endpoint?.dangerousityNumber ?? 'Inconnu'})</p>
            <p><strong>Pourcentage de coherence :</strong> {PourcentageCoherence() ?? 'Inconnu'}%</p>
            <p><strong>Antivirus :</strong> {endpoint.AntivirusNom ?? 'Inconnu'} (Version {endpoint.AntivirusVersion ?? 'Inconnu'}) — Actif : {endpoint.AntivirusActif ?? 'Inconnu'}</p>
            <p><strong>Système :</strong> {endpoint.OperatingSystem ?? 'Inconnu'} — Version : {endpoint.OperatingSystemVersion ?? 'Inconnu'}</p>
            <p><strong>Adresse IP :</strong> {endpoint.IPv4Address ?? 'Inconnu'}</p>
            <p><strong>Date dernière connexion :</strong> {new Date(endpoint.LastLogonDate).toLocaleString() ?? 'Inconnu'}</p>
            <p><strong>Volumes libres :</strong> {endpoint.VolumesPourcentageLibre ?? 'Inconnu'}</p>
            <p><strong>Nom :</strong> {endpoint.Nom ?? 'Inconnu'}</p>
            <p><strong>Nom DNS :</strong> {endpoint.DNSHostName ?? 'Inconnu'}</p>
            <p><strong>Nom Canonique :</strong> {endpoint.CanonicalName ?? 'Inconnu'}</p>
            <p><strong>Protection en temps Reel :</strong> {endpoint.protectionTempsReel ?? 'Inconnu'}</p>
            <p><strong>Statut activé :</strong> {endpoint.Enabled ?? 'Inconnu'}</p>
            <p><strong>Appartient a :</strong> {endpoint.groupeParent ?? 'Inconnu'}</p>
            <p><strong>Comptes mauvais logins :</strong> {endpoint.BadLogonCount ?? 'Inconnu'}</p>
            <p><strong>Etat de chiffrement du disque :</strong> {endpoint.etatChiffrement ?? 'Inconnu'}</p>
            <p><strong>Non Conformes :</strong> {endpoint.ConformitiesChecked?.join(', ') || 'Aucune'}</p>
            <p><strong>Incoherences :</strong> {endpoint.incoherences?.join(', ') || 'Aucune'}</p>
            <p><strong>Composants :</strong> {endpoint.Composites?.join(', ') || 'Aucune'}</p>
            {critiquesDurables && (
              <p>
                <strong>Résultat d'analyse des logs :</strong> {critiquesDurables.endpoint ?? 'Inconnu'} est au niveau de conformité {critiquesDurables.niveau ?? 'Inconnu'} depuis {critiquesDurables.jours ?? 'Inconnu'} jours ({new Date(critiquesDurables.depuis).toLocaleDateString() ?? 'Inconnu'} - {new Date(critiquesDurables.jusqua).toLocaleDateString() ?? 'Inconnu'})
              </p>
            )}
            <p><strong>Date de création :</strong> {new Date(endpoint.whenCreated).toLocaleDateString() ?? 'Inconnu'}</p>
            <p><strong>Date de derniere analyse complete :</strong> {new Date(endpoint.DerniereAnalyseComplete).toLocaleDateString() ?? 'Inconnu'}</p>
            <p><strong>Date de derniere mise a jour des bases antivirus :</strong> {new Date(endpoint.DerniereMiseAJourBasesAntivirus).toLocaleDateString() ?? 'Inconnu'}</p>
          </div>
        </div>
      </div>
  );

}

export default Endpoint;
