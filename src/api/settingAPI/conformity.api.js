import axios from 'axios';

// Appelle l'API pour mettre à jour les paramètres de conformité
async function updateConformityTable({ adminId, selectedValues }) {
  try {
    const session = localStorage.getItem('adminSession');
    if (!session) throw new Error('Session introuvable');

    const { token } = JSON.parse(session);
    if (!token) throw new Error('Token manquant dans la session');

    const response = await axios.put('http://localhost:5000/api/conformitySetting', {
      adminId,
      conformityToCheck: selectedValues
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    return response;
  } catch (error) {
    const message = error.response?.data?.message || 'Échec de la mise à jour de la table de conformité';
    console.error('Erreur updateConformityTable:', message);
    throw new Error(message);
  }
}

export default updateConformityTable;
