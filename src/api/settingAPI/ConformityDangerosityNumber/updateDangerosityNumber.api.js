import axios from 'axios';

// Appelle l'API pour mettre à jour les paramètres de dangerosité
async function updateDangerosityNumber(updatedValues) {
  try {
    const session = localStorage.getItem('adminSession');
    if (!session) throw new Error('Session introuvable');

    const { token } = JSON.parse(session);
    if (!token) throw new Error('Token manquant dans la session');

    // On envoie directement les champs du schéma (pas conformityToCheck)
    const response = await axios.put(`http://${import.meta.env.VITE_API_IP}:${import.meta.env.VITE_API_PORT}/api/conformityDangerosityNumber`,
      { updatedValues },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      'Échec de la mise à jour de la table de dangerosité';
    console.error('Erreur updateDangerosityNumber:', message);
    throw new Error(message);
  }
}

export default updateDangerosityNumber;
