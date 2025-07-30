import axios from 'axios';

//Appelle l'API pour récupérer un utilisateur
function fetchUser(id) {
  return axios.get(`http://localhost:5000/api/admin/${id}`);
}

export default fetchUser;