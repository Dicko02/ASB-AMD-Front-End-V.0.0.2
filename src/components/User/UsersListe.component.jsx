import React, { useState } from 'react';
import Loading from '../Complements/Loading.component';
import fetchUsers from '../../api/usersAPI/allUsers.api'; // Importation de l'API personnalisée pour récupérer les utilisateurs
import deleteUser from '../../api/usersAPI/deleteUser.api';
import { useNavigate } from 'react-router-dom';// importation du hook useNavigate pour la navigation entre les pages


function UsersListe() {
  const [filter, setFilter] = useState('');
  const [users, setUsers] = React.useState([]);// État pour stocker les utilisateurs récupérés depuis l'API
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();// Hook pour la navigation entre les pages

  // Chargement des utilisateurs à l’affichage initial du composant
  React.useEffect(() => {
    async function chargerUsers() {
      try {
        const response = await fetchUsers();
        setUsers(response.data); // Met à jour l’état avec les données reçues
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs : ", error);
      }finally {
        setLoading(false);
      }
    }
    
  
    chargerUsers();
  }, 
    
  []/* 👈 Dépendances vides pour charger une seule fois */ );


  const filteredAdmins = users.filter(admin =>
    admin.pseudo.toLowerCase().includes(filter.toLowerCase())
  );

  async function handleDelete(id) {
    const confirm = window.confirm('Êtes-vous sûr de vouloir supprimer cet administrateur ?');
    if (!confirm) return;

    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(admin => admin.id !== id));
      console.log('✅ Utilisateur supprimé avec succès');
    } catch (error) {
      console.log(`❌ Erreur lors de la suppression : ${error.message}`);
    }
  };

  const UserModif = (id) => {
    navigate(`/UsersManagement/${id}`);// Redirection
  };

  if (loading){
    return <Loading text="chargement de la liste des utilisateurs..." />;
  };

  return (
    <div style={{
      maxWidth: '700px',
      margin: '40px auto',
      padding: '20px',
      borderRadius: '12px',
      backgroundColor: '#f8f9fa',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#343a40' }}>
        Liste des Administrateurs
      </h2>

      <input
        type="text"
        placeholder="Rechercher par pseudo..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: '8px',
          border: '1px solid #ced4da',
          marginBottom: '20px',
          fontSize: '16px'
        }}
      />

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {filteredAdmins.length > 0 ? (
          filteredAdmins.map((admin) => (
            <li key={admin._id} style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s',
            }}>

              <div>
                <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#212529' }}>
                  {admin.pseudo}
                </div>
                <div style={{ color: '#6c757d', fontSize: '14px' }}>
                  {admin.titre}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => UserModif(admin._id)} style={{
                  backgroundColor: '#ADD8E6',
                  color: 'black',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: admin.titre === 'Super Admin' ? 'none' : 'block'
                }}>
                  📝
                </button>

                <button onClick={() => handleDelete(admin._id)} style={{
                  backgroundColor: '#F08080',
                  color: 'black',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: admin.titre === 'Super Admin' ? 'none' : 'block'
                }}>
                  🗑️
                </button>
              </div>

            </li>
          ))
        ) : (
          <li style={{
            textAlign: 'center',
            color: '#999',
            fontStyle: 'italic',
            marginTop: '30px'
          }}>
            Aucun administrateur ne correspond à votre recherche.
          </li>
        )}
      </ul>
    </div>
  );
}

export default UsersListe;
