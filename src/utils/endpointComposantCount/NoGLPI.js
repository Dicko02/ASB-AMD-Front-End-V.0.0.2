import fetchEndpoints from '../../api/endpoint/allEndpoints.api';
import fetchEndpointsNoAD from '../../api/noAD.api';
import countEndpoints from './EndpointTotalCount';

// Fonction pour compter le nombre d'endpoints n'etant pas dans GLPI
async function countEndpointsNoGLPI() {
  try {
    const response01 = await fetchEndpoints();
    const response02 = await fetchEndpointsNoAD();
    const endpoints01 = response01.data;
    const endpoints02 = response02.data;

    const total = await countEndpoints();
    let count = 0;

    for(const endpoint of endpoints01){
        if(endpoint.Composites.includes("GLPI")){
            count = count + 1;
        }
    }

    for(const endpoint of endpoints02){
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