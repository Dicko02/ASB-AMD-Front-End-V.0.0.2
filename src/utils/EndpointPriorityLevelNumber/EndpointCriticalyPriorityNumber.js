import fetchEndpoints from '../../api/endpoint/allEndpoints.api';

// Fonction pour compter le nombre d'endpoints avec un niveau de dangerosité "critical"
async function countCriticalPriorityEndpoints() {
  try {
    const response = await fetchEndpoints();
    const endpoints = response.data;

    let endpointsCriticalPriorityNumber = 0;

    for (const endpoint of endpoints) {
        if(endpoint.criticalLevel === "critical") {
            endpointsCriticalPriorityNumber++; // On incrémente le compteur si le niveau de dangerosité est "critical"
        }
    }

    return endpointsCriticalPriorityNumber; // On retourne le nombre
  } catch (error) {
    console.error("Erreur lors du comptage du nombre d'endpoints au niveau de dangerisite critique :", error);
    return 0; // Si erreur, retourne 0 pour éviter un crash
  }
}

export default countCriticalPriorityEndpoints;
