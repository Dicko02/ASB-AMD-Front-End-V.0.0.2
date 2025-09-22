import fetchEndpoints from '../../api/endpoint/allEndpoints.api';
import countEndpoints from '../EndpointPriorityLevelNumber/EndpointTotalNumber';

// Fonction pour compter le nombre d'endpoints n'etant pas dans GLPI
async function countEndpointsNoGLPI() {
  try {
    const response = await fetchEndpoints();
    const endpoints = response.data;

    const total = await countEndpoints();
    let count = 0;

    for(const endpoint of endpoints){
      if(endpoint.Composites.includes("GLPI")){
        count = count + 1;
      }
    }

    const result = total - count;
    return result;
    
  } catch (error) {
    console.error("Erreur lors du comptage des endpoints n'etant pas dans GLPI :", error);
    return 0;
  }
}

export default countEndpointsNoGLPI;