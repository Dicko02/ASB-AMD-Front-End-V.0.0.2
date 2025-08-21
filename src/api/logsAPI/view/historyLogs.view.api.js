import axios from 'axios';

// Appelle l'API pour récupérer les logs de history
async function fetchHistoryLogs() {
  try {
    const session = localStorage.getItem('adminSession');
    if (!session) throw new Error('Session introuvable');

    const { token } = JSON.parse(session);
    if (!token) throw new Error('Token manquant dans la session');

    const response = await axios.get(`http://${import.meta.env.VITE_API_IP}:${import.meta.env.VITE_API_PORT}/api/logs/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    const message = error.response?.data?.message || 'Échec de la récupération des logs de history';
    console.error('Erreur fetchHistoryLogs:', message);
    throw new Error(message);
  }
}

export default fetchHistoryLogs;
