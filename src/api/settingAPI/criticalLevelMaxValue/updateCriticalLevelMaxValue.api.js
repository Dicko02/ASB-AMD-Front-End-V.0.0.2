import axios from 'axios';

// Appelle l'API pour mettre à jour les paramètres de niveau critique maximum
async function updateCriticalLevelMaxValue(updatedValues) {
  try {
    const session = localStorage.getItem('adminSession');
    if (!session) throw new Error('Session introuvable');

    const { token } = JSON.parse(session);
    if (!token) throw new Error('Token manquant dans la session');

    const response = await axios.put(`http://${import.meta.env.VITE_API_IP}:${import.meta.env.VITE_API_PORT}/api/criticalLevelMaxValue`,
      { updatedValues },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
    
  } catch (error) {
    const message = error.response?.data?.message || 'Échec de la mise à jour de la table de niveau critique maximum';
    console.error('Erreur updateCriticalLevelMaxValue:', message);
    throw new Error(message);
  }
}

export default updateCriticalLevelMaxValue;
