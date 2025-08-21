import axios from 'axios';

//Appelle l'API pour la connection de l'admin
async function loginAdmin({ pseudo, password }) {
  try {
    const response = await axios.post(`http://${import.meta.env.VITE_API_IP}:${import.meta.env.VITE_API_PORT}/api/admin/login`, {
      pseudo,
      password
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Identifiants incorrects';
    throw new Error(message);
  }
}

export default loginAdmin;
