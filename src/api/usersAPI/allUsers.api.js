import axios from 'axios';

//Appelle l'API pour récupérer les utilisateurs
function fetchUsers() {
  try {
    const session = localStorage.getItem('adminSession');
    if (!session) throw new Error('Pas de session en localStorage');

    const { token } = JSON.parse(session);
    if (!token) throw new Error('Token manquant dans la session');

    return axios.get(`http://${import.meta.env.VITE_API_IP}:${import.meta.env.VITE_API_PORT}/api/admin/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
  } catch (err) {
    console.error('Erreur lors de la récupération du token:', err.message);
    return Promise.reject(err);
  }
}

export default fetchUsers;
