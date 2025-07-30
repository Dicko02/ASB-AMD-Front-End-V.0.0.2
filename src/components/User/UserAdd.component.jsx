import { useState, useEffect } from 'react';
import registerAdmin from '../../api/usersAPI/registerUser.api';
import Loading from '../Complements/Loading.component';

function UserAdd({ admin, onSuccess }) {
  const [pseudo, setPseudo] = useState('');
  const [titre, setTitre] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // false au départ, on ne charge rien encore
  const [message, setMessage] = useState('');

  // Remplit les champs si admin est passé (utile si tu veux faire update ET create dans un même composant)
  useEffect(() => {
    if (admin) {
      setPseudo(admin.pseudo || '');
      setTitre(admin.titre || '');
      setPassword('');
    } else {
      // Pas d'admin => formulaire vide (création)
      setPseudo('');
      setTitre('');
      setPassword('');
    }
  }, [admin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await registerAdmin({ pseudo, titre, password });
      setMessage('✅ Ajout réussi');
      if (onSuccess) onSuccess(); // callback pour actualiser ou fermer le formulaire
      // Optionnel : réinitialiser le formulaire
      setPseudo('');
      setTitre('');
      setPassword('');
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading text={`Chargement...`} />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: '500px',
        margin: '30px auto',
        padding: '24px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h3
        style={{
          textAlign: 'center',
          marginBottom: '20px',
          color: '#343a40',
        }}
      >
        Ajouter un administrateur
      </h3>

      <div style={{ marginBottom: '16px' }}>
        <label
          style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}
        >
          Pseudo
        </label>
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
            fontSize: '16px',
          }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label
          style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}
        >
          Titre
        </label>
        <select
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '16px',
          }}
        >
          <option value="" disabled>
            --Niveau d'administration--
          </option>
          <option value="Admin">Admin</option>
          <option value="Super Admin">Super Admin</option>
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label
          style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}
        >
          Mot de passe
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Entrez un mot de passe"
          required
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '16px',
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
          cursor: 'pointer',
        }}
      >
        {loading ? 'Ajout en cours...' : 'Ajouter'}
      </button>

      {message && (
        <p
          style={{
            marginTop: '20px',
            textAlign: 'center',
            color: message.startsWith('✅') ? 'green' : 'red',
            fontWeight: 'bold',
          }}
        >
          {message}
        </p>
      )}
    </form>
  );
}

export default UserAdd;
