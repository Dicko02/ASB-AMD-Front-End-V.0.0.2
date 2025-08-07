import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from './Complements/Loading.component'; // <-- importer le composant Loading
import loginAdmin from '../api/connexion.api'; // <-- import de ta fonction avec Axios

function Connexion() {
  const [pseudo, setPseudo] = useState('');
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  const [loading, setLoading] = useState(false); // <-- nouvel état pour loading
  const navigate = useNavigate();

  // Fonction déclenchée lors de la soumission du formulaire
  const handleConnexion = async (e) => {
    e.preventDefault();
    setErreur('');
    setLoading(true); // <-- on active le loading ici

    try {
      // Utilisation de la fonction Axios importée
      const data = await loginAdmin({ pseudo, password });

      // On stocke les infos de session dans le localStorage
      localStorage.setItem('adminSession', JSON.stringify({
        id: data.id,
        pseudo: data.pseudo,
        titre: data.titre,
        token: data.token
      }));

      navigate('/DashBoard');
    } catch (err) {
      setErreur(err.message || 'Identifiants incorrects');
      setLoading(false); // désactive le loading en cas d'erreur
    }
  };

  // Affichage conditionnel : si loading, on affiche Loading, sinon le formulaire
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <Loading text="Connexion en cours..." />
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Connexion Administrateur</h2>
        {erreur && <p style={{ color: 'red', textAlign: 'center', marginBottom: '16px' }}>{erreur}</p>}
        <form onSubmit={handleConnexion} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="text"
            placeholder="Pseudo"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            required
            style={{
              padding: '12px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: '12px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '12px',
              fontSize: '16px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default Connexion;
