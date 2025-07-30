import { useState, useEffect } from 'react';
import updateAdmin from '../../api/usersAPI/updateUser.api';
import Loading from '../Complements/Loading.component';
import { useParams } from 'react-router-dom';

function UserModif({ admin, onSuccess }) {
  const [pseudo, setPseudo] = useState('');
  const [titre, setTitre] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { id } = useParams();

  // Remplit les champs à l'ouverture
  useEffect(() => {
    if (!admin) {
      setLoading(false);
      return;
    }
    setPseudo(admin.pseudo || '');
    setTitre(admin.titre || '');
    setPassword('');
    setLoading(false);
  }, [admin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await updateAdmin({ pseudo, titre, password }, id);
      setMessage('✅ Mise à jour réussie');
      if (onSuccess) onSuccess(); // callback pour actualiser la liste ou fermer le formulaire
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading){
    return <Loading text={`chargement du formulaire de modification de ${pseudo}...`} />;
  }

  return (
    <form onSubmit={handleSubmit} style={{
      maxWidth: '500px',
      margin: '30px auto',
      padding: '24px',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h3 style={{
        textAlign: 'center',
        marginBottom: '20px',
        color: '#343a40'
      }}>
        Modifier l’administrateur
      </h3>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Pseudo</label>
        <input
          type="text"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '16px'
          }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Titre</label>
        <select
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '16px'
          }}
        >
          <option value="" disabled>--Niveau d'administration--</option>
          <option value="Admin">Admin</option>
          <option value="Super Admin">Super Admin</option>
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Nouveau mot de passe</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Laisse vide si inchangé"
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '16px'
          }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: loading ? '#6c757d' : '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        {loading ? 'Mise à jour...' : 'Mettre à jour'}
      </button>

      {message && (
        <p style={{
          marginTop: '20px',
          textAlign: 'center',
          color: message.startsWith('✅') ? 'green' : 'red',
          fontWeight: 'bold'
        }}>
          {message}
        </p>
      )}
    </form>
  );
}

export default UserModif;
