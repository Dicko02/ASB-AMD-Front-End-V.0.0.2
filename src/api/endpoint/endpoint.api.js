import axios from 'axios';

//Appelle l'API pour récupérer un endpoint
function fetchEndpoint(CN) {
  return axios.get(`http://localhost:5000/api/fusion/${CN}`);
}

export default fetchEndpoint;
