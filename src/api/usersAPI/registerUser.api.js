import axios from 'axios';

//Appelle l'API pour l'ajout d'un admin
async function registerAdmin({ pseudo, titre, password }) {
  try {
    const response = await axios.post('http://localhost:5000/api/admin/register', {
      pseudo,
      titre,
      password
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Ajout Echouer';
    throw new Error(message);
  }
}

export default registerAdmin;