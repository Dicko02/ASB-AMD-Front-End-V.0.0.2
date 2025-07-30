import axios from 'axios';

//Appelle l'API pour récupérer les utilisateurs
function fetchNoAD() {
  return axios.get('http://localhost:5000/api/noAd/');
}

export default fetchNoAD;
