import axios from 'axios';

//Appelle l'API pour récupérer les utilisateurs
function fetchUsers() {
  return axios.get('http://localhost:5000/api/admin/');
}

export default fetchUsers;