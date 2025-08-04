import axios from 'axios';

// Appelle l'API pour la mise à jour d'un admin
async function updateAdmin({ pseudo, titre, password }, id) {
  try {
    const session = localStorage.getItem('adminSession');
    if (!session) throw new Error('Pas de session trouvée');

    const { token } = JSON.parse(session);
    if (!token) throw new Error('Token manquant dans la session');

    const response = await axios.put(
      `http://localhost:5000/api/admin/update/${id}`,
      { pseudo, titre, password },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
    
  } catch (error) {
    const message = error.response?.data?.message || 'Mise à jour échouée';
    console.error('Erreur updateAdmin:', message);
    throw new Error(message);
  }
}

export default updateAdmin;
