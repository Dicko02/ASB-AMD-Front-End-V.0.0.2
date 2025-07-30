import fetchEndpoints from '../../api/endpoint/allEndpoints.api';

// Fonction pour compter le nombre d'endpoints
async function countEndpoints() {
  try {
    const response = await fetchEndpoints();
    const endpoints = response.data;
    const endpointsTotalNumber = endpoints.length;

    return endpointsTotalNumber; // On retourne le nombre
  } catch (error) {
    console.error("Erreur lors du comptage des endpoints :", error);
    return 0; // Si erreur, retourne 0 pour éviter un crash
  }
}

export default countEndpoints;
