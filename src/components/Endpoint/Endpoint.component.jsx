import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import fetchEndpoint from '../../api/endpoint/endpoint.api';
import Loading from '../Complements/Loading.component';
import exporteCSV from '../../utils/Export/ExportCSV';
import {exportePDFDetailEndpoint} from '../../utils/Export/ExportPDF';

function Endpoint() {
  const { CN } = useParams();
  const [endpoint, setEndpoint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  function PourcentageIncoherence(){
    let result = (endpoint.incoherenceNumber * 100)/endpoint.incoherenceTotalScore;
    let arrondi = result.toFixed(2); // retourne une chaîne "3.33"
    //let nombre = parseFloat(arrondi);  // convertit en nombre 3.33 si nécessaire
    return arrondi;
  }

  return (
    <div
      style={{
        maxWidth: 900,
        margin: '40px auto',
        padding: 20,
        fontFamily: 'Arial, sans-serif',
        lineHeight: 1.6,
        backgroundColor: '#f9fafb',
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
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e5e7eb'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f3f4f6'}
        >
          Export CSV
        </button>

        <button
          onClick={() => exportePDFDetailEndpoint(endpoint, `endpoint-${endpoint.CN || 'unique'}`)}
          style={{
            backgroundColor: '#f3f4f6',
            border: '1px solid #ccc',
            borderRadius: '6px',
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e5e7eb'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f3f4f6'}
        >
          Export PDF
        </button>
      </div>

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
        <p><strong>Utilisateur :</strong> {endpoint.Utilisateur}</p>
        <p><strong>Niveau de dangerosité :</strong> {endpoint.criticalLevel} (score : {endpoint.dangerousityNumber})</p>
        <p><strong>Pourcentage d'incoherences :</strong> {PourcentageIncoherence()}%</p>
        <p><strong>Antivirus :</strong> {endpoint.AntivirusNom} (Version {endpoint.AntivirusVersion}) — Actif : {endpoint.AntivirusActif}</p>
        <p><strong>Système :</strong> {endpoint.OperatingSystem} — Version : {endpoint.OperatingSystemVersion}</p>
        <p><strong>Adresse IP :</strong> {endpoint.IPv4Address}</p>
        <p><strong>Date dernière connexion :</strong> {new Date(endpoint.LastLogonDate).toLocaleString()}</p>
        <p><strong>Volumes libres :</strong> {endpoint.VolumesPourcentageLibre}</p>
        <p><strong>Nom :</strong> {endpoint.Nom}</p>
        <p><strong>Nom DNS :</strong> {endpoint.DNSHostName}</p>
        <p><strong>Nom Canonique :</strong> {endpoint.CanonicalName}</p>
        <p><strong>Protection en temps Reel :</strong> {endpoint.protectionTempsReel}</p>
        <p><strong>Statut activé :</strong> {endpoint.Enabled}</p>
        <p><strong>Appartient a :</strong> {endpoint.groupeParent}</p>
        <p><strong>Comptes mauvais logins :</strong> {endpoint.BadLogonCount}</p>
        <p><strong>Etat de chiffrement du disque :</strong> {endpoint.etatChiffrement}</p>
        <p><strong>Non Conformes :</strong> {endpoint.ConformitiesChecked?.join(', ') || 'Aucune'}</p>
        <p><strong>Incoherences :</strong> {endpoint.incoherences?.join(', ') || 'Aucune'}</p>
        <p><strong>Composants :</strong> {endpoint.Composites?.join(', ') || 'Aucune'}</p>
        <p><strong>Date de création :</strong> {new Date(endpoint.whenCreated).toLocaleDateString()}</p>
        <p><strong>Date de derniere analyse complete :</strong> {new Date(endpoint.DerniereAnalyseComplete).toLocaleDateString()}</p>
        <p><strong>Date de derniere mise a jour des bases antivirus :</strong> {new Date(endpoint.DerniereMiseAJourBasesAntivirus).toLocaleDateString()}</p>
      </div>
    </div>
  );

}

export default Endpoint;
