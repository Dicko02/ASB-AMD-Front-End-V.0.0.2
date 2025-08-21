import axios from 'axios';

// Appelle l'API pour l'ajout d'un admin
async function registerAdmin({ pseudo, titre, password }) {
  try {
    const session = localStorage.getItem('adminSession');
    if (!session) throw new Error('Pas de session en localStorage');

    const { token } = JSON.parse(session);
    if (!token) throw new Error('Token manquant dans la session');

    const response = await axios.post(
      `http://${import.meta.env.VITE_API_IP}:${import.meta.env.VITE_API_PORT}/api/admin/register`,
      { pseudo, titre, password },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
    
  } catch (error) {
    const message = error.response?.data?.message || 'Ajout échoué';
    console.error('Erreur registerAdmin:', message);
    throw new Error(message);
  }
}

export default registerAdmin;
