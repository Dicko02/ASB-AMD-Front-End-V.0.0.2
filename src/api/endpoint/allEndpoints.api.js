import axios from 'axios';

//Appelle l'API pour récupérer les endpoints
function fetchEndpoints() {
  return axios.get('http://localhost:5000/api/fusion/');
}

export default fetchEndpoints;
