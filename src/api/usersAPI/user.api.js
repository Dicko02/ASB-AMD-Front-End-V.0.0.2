import axios from 'axios';

// Appelle l'API pour récupérer un utilisateur par ID
async function fetchUser(id) {
  try {
    const session = localStorage.getItem('adminSession');
    if (!session) throw new Error('Session introuvable');

    const { token } = JSON.parse(session);
    if (!token) throw new Error('Token manquant');

    const response = await axios.get(`http://${import.meta.env.VITE_API_IP}:${import.meta.env.VITE_API_PORT}/api/admin/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response;
    
  } catch (error) {
    const message = error.response?.data?.message || 'Erreur lors de la récupération de l’utilisateur';
    console.error('Erreur fetchUser:', message);
    throw new Error(message);
  }
}

export default fetchUser;
