import axios from 'axios';

// Appelle l'API pour récupérer les utilisateurs sans AD
async function fetchNoAD() {
  try {
    const session = localStorage.getItem('adminSession');
    if (!session) throw new Error('Session introuvable');

    const { token } = JSON.parse(session);
    if (!token) throw new Error('Token manquant dans la session');

    const response = await axios.get('http://localhost:5000/api/noAd/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;

  } catch (error) {
    const message = error.response?.data?.message || 'Échec de la récupération des utilisateurs non-AD';
    console.error('Erreur fetchNoAD:', message);
    throw new Error(message);
  }
}

export default fetchNoAD;
