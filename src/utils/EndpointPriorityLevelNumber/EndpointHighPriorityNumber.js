import fetchEndpoints from '../../api/endpoint/allEndpoints.api';

// Fonction pour compter le nombre d'endpoints avec un niveau de dangerosité "high"
async function countHighPriorityEndpoints() {
  try {
    const source = await fetchEndpoints()

    const endpoints = source.data || [];

    let endpointsHighPriorityNumber = 0;

    for (const endpoint of endpoints) {
      if(endpoint.criticalLevel === "high") {
        endpointsHighPriorityNumber++; // On incrémente le compteur si le niveau de dangerosité est "high"
      }
    }

    return endpointsHighPriorityNumber; // On retourne le nombre
  } catch (error) {
    console.error("Erreur lors du comptage du nombre d'endpoints au niveau de dangerisite haut :", error);
    return 0; // Si erreur, retourne 0 pour éviter un crash
  }
}

export default countHighPriorityEndpoints;
