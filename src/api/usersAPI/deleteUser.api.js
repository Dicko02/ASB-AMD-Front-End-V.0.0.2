import axios from 'axios';

//Appelle l'API pour la suppression d'un utilisateur
function deleteUser(id) {
  return axios.delete(`http://localhost:5000/api/admin/delete/${id}`);
}

export default deleteUser;