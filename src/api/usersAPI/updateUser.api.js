import axios from 'axios';

//Appelle l'API pour la mise a jour d'un admin
async function updateAdmin({ pseudo, titre, password }, id) {
  try {
    const response = await axios.put(`http://localhost:5000/api/admin/update/${id}`, {
      pseudo,
      titre,
      password
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Mise a jour Echouer';
    throw new Error(message);
  }
}

export default updateAdmin;