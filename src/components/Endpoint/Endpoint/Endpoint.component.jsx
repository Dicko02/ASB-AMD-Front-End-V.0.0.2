import './Endpoint.component.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import fetchEndpoint from '../../../api/endpoint/endpoint.api';
import Loading from '../../Complements/Loading.component';
import exporteCSV from '../../../utils/Export/ExportCSV';
import {exportePDFDetailEndpoint} from '../../../utils/Export/ExportPDF';
import critiquesDurablesEndpoint from '../../../utils/critiquesDurablesEndpoint'

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
        maxWidth: 1000,
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
          <div className="endpoint-card">
            <ul className="endpoint-list">
              <li className="endpoint-item">
                <span className="endpoint-label">Utilisateur</span>
                <span className="endpoint-value">{endpoint.Utilisateur ?? 'Inconnu'}</span>
              </li>

              <li className="endpoint-item">
                <span className="endpoint-label">Type de machine</span>
                <span className="endpoint-value">{endpoint.typeMachine}</span>
              </li>

              <li className="endpoint-item">
                <span className="endpoint-label">Niveau de dangerosité</span>
                <span className="endpoint-danger">
                  {endpoint.criticalLevel ?? 'Inconnu'} (score : {endpoint?.dangerousityNumber ?? 'Inconnu'})
                </span>
              </li>

              <li className="endpoint-item">
                <span className="endpoint-label">Pourcentage de cohérence</span>
                <span className="endpoint-coherence">{PourcentageCoherence() ?? 'Inconnu'}%</span>
              </li>

              <li className="endpoint-item">
                <span className="endpoint-label">Antivirus</span>
                <span className="endpoint-antivirus">
                  {endpoint.AntivirusNom ?? 'Inconnu'} (v{endpoint.AntivirusVersion ?? 'Inconnu'}) — Actif : {endpoint.AntivirusActif ?? 'Inconnu'}
                </span>
              </li>

              <li className="endpoint-item">
                <span className="endpoint-label">Système</span>
                <span className="endpoint-value">
                  {endpoint.OperatingSystem ?? 'Inconnu'} — Version {endpoint.OperatingSystemVersion ?? 'Inconnu'}
                </span>
              </li>

              <li className="endpoint-item">
                <span className="endpoint-label">Adresse IP</span>
                <span className="endpoint-ip">{endpoint.IPv4Address ?? 'Inconnu'}</span>
              </li>

              <li className="endpoint-item">
                <span className="endpoint-label">Date dernière connexion</span>
                <span className="endpoint-value">{new Date(endpoint.LastLogonDate).toLocaleString() ?? 'Inconnu'}</span>
              </li>

              <li className="endpoint-item">
                <span className="endpoint-label">Volumes libres</span>
                <span className="endpoint-value">{endpoint.VolumesPourcentageLibre ?? 'Inconnu'}</span>
              </li>

              <li className="endpoint-item">
                <span className="endpoint-label">Nom</span>
                <span className="endpoint-value">{endpoint.Nom ?? 'Inconnu'}</span>
              </li>

              <li className="endpoint-item">
                <span className="endpoint-label">Nom DNS</span>
                <span className="endpoint-value">{endpoint.DNSHostName ?? 'Inconnu'}</span>
              </li>

              <li className="endpoint-item">
                <span className="endpoint-label">Nom Canonique</span>
                <span className="endpoint-value">{endpoint.CanonicalName ?? 'Inconnu'}</span>
              </li>

              <li className="endpoint-item">
                <span className="endpoint-label">Protection en temps réel</span>
                <span className="endpoint-value">{endpoint.protectionTempsReel ?? 'Inconnu'}</span>
              </li>

              <li className="endpoint-item">
                <span className="endpoint-label">Statut activé</span>
                <span className="endpoint-value">{endpoint.Enabled ?? 'Inconnu'}</span>
              </li>

              <li className="endpoint-item">
                <span className="endpoint-label">Appartient à</span>
                <span className="endpoint-value">{endpoint.groupeParent ?? 'Inconnu'}</span>
              </li>

              <li className="endpoint-item">
                <span className="endpoint-label">Comptes mauvais logins</span>
                <span className="endpoint-warning">{endpoint.BadLogonCount ?? 'Inconnu'}</span>
              </li>

              <li className="endpoint-item">
                <span className="endpoint-label">État de chiffrement du disque</span>
                <span className="endpoint-value">{endpoint.etatChiffrement ?? 'Inconnu'}</span>
              </li>

              <li className="endpoint-item">
                <span className="endpoint-label">Non Conformes</span>
                <ul className="endpoint-value">
                  {endpoint.ConformitiesChecked && endpoint.ConformitiesChecked.length > 0 ? (
                    endpoint.ConformitiesChecked.map((item, id) => (
                      <li key={id}>_{item};</li>
                    ))
                  ) : (
                    <li>Aucune</li>
                  )}
                </ul>
              </li>

              <li className="endpoint-item">
                <span className="endpoint-label">Incohérences</span>
                <ul className="endpoint-value">
                  {endpoint.incoherences && endpoint.incoherences.length > 0 ? (
                    endpoint.incoherences.map((item, id) => (
                      <li key={id}>_{item};</li>
                    ))
                  ) : (
                    <li>Aucune</li>
                  )}
                </ul>
              </li>

              <li className="endpoint-item">
                <span className="endpoint-label">Composants</span>
                <span className="endpoint-value">{endpoint.Composites?.join(', ') || 'Aucune'}</span>
              </li>

              {critiquesDurables && (
                <li className="endpoint-item">
                  <span className="endpoint-label">Résultat d'analyse des logs</span>
                  <span className="endpoint-value">
                    {critiquesDurables.endpoint ?? 'Inconnu'} — Conformité {critiquesDurables.niveau ?? 'Inconnu'} 
                    depuis {critiquesDurables.jours ?? 'Inconnu'} jours 
                    ({new Date(critiquesDurables.depuis).toLocaleDateString() ?? 'Inconnu'} - {new Date(critiquesDurables.jusqua).toLocaleDateString() ?? 'Inconnu'})
                  </span>
                </li>
              )}

              <li className="endpoint-item">
                <span className="endpoint-label">Date de création</span>
                <span className="endpoint-value">{new Date(endpoint.whenCreated).toLocaleDateString() ?? 'Inconnu'}</span>
              </li>

              <li className="endpoint-item">
                <span className="endpoint-label">Dernière analyse complète</span>
                <span className="endpoint-value">{new Date(endpoint.DerniereAnalyseComplete).toLocaleDateString() ?? 'Inconnu'}</span>
              </li>

              <li className="endpoint-item">
                <span className="endpoint-label">Dernière mise à jour AV</span>
                <span className="endpoint-value">{new Date(endpoint.DerniereMiseAJourBasesAntivirus).toLocaleDateString() ?? 'Inconnu'}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
  );

}

export default Endpoint;
