import axios from 'axios';

// Appelle l'API pour récupérer les endpoints
async function fetchCritiquesDurables() {
  try {
    const session = localStorage.getItem('adminSession');
    if (!session) throw new Error('Session introuvable');

    const { token } = JSON.parse(session);
    if (!token) throw new Error('Token manquant dans la session');

    const response = await axios.get('http://localhost:5000/api/logs/critiquesDurables', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    const message = error.response?.data?.message || 'Échec de la récupération des endpoints critiques durables';
    console.error('Erreur fetchCritiquesDurables:', message);
    throw new Error(message);
  }
}

export default fetchCritiquesDurables;
