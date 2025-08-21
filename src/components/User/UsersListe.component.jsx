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

  function handleLogout(){
    localStorage.removeItem('adminSession');
    window.location.href = '/';
  };

  async function handleDelete(id, pseudo1, titre, pseudo2) {
    const confirm = window.confirm(`Êtes-vous sûr de vouloir supprimer le compte ${titre} ${pseudo1} ?`);
    if (!confirm) return;

    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(admin => admin.id !== id));
      alert('✅ Utilisateur supprimé avec succès');
      if(pseudo1 === pseudo2){
        handleLogout();
      }
    } catch (error) {
      console.log(`❌ Erreur lors de la suppression : ${error.message}`);
    }
  };

  const UserModif = (id) => {
    navigate(`/UsersManagement/${id}`);// Redirection
  };

  function addUser(){
    navigate("/AddUser");
  };
  

  const adminSessionStr = localStorage.getItem('adminSession'); // chaîne JSON
  const adminSession = JSON.parse(adminSessionStr); // maintenant un objet JS
  const titre = adminSession.titre;
  const pseudo = adminSession.pseudo;

  function deleteAppear(admin){
    if(admin.pseudo === pseudo){
      return 'block';
    }else if(admin.titre === 'Super Admin'){
      return 'none';
    }else{
      return 'block';
    }
  }

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
      <h2 style={{ textAlign: 'center', marginBottom: '10px', color: '#343a40' }}>
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
          fontSize: '16px'
        }}
      />

      <button onClick={() => addUser()}
        style={{
          backgroundColor: 'lightgreen',
            border: 'none',
            padding: '8px 14px',
            margin: '10px auto',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '30px',
            display: titre === 'Super Admin' ? 'block' : 'none'
        }}
      >➕</button>

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
                  display: deleteAppear(admin)
                }}>
                  📝
                </button>

                <button onClick={() => handleDelete(admin._id, admin.pseudo, admin.titre, pseudo)} style={{
                  backgroundColor: '#F08080',
                  color: 'black',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: deleteAppear(admin)
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
            Aucun compte utilisateur ne correspond à votre recherche.
          </li>
        )}
      </ul>
    </div>
  );
}

export default UsersListe;
