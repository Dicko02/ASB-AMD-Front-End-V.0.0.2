import countEndpoints from '../EndpointPriorityLevelNumber/EndpointTotalNumber';
import countEndpointsNoAD from './NoAD';

// Fonction pour compter le nombre total d'endpoints present dans le system
async function countTotalEndpoints() {
    try {
        const endpoints = await countEndpoints();
        const noAD = await countEndpointsNoAD();
        const result = endpoints + noAD;
        return result;
  } catch (error) {
    console.error("Erreur lors du comptage des endpoints normaux et endpoints NoAD :", error);
    return 0; // Si erreur, retourne 0 pour éviter un crash
  }

}

export default countTotalEndpoints;