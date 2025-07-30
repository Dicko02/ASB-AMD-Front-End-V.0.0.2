import fetchEndpoints from '../../api/endpoint/allEndpoints.api';

// Fonction pour compter le nombre d'endpoints avec un niveau de dangerosité "low"
async function countLowPriorityEndpoints() {
  try {
    const response = await fetchEndpoints();
    const endpoints = response.data;

    let endpointsLowPriorityNumber = 0;

    for (const endpoint of endpoints) {
        if(endpoint.criticalLevel === "low") {
            endpointsLowPriorityNumber++; // On incrémente le compteur si le niveau de dangerosité est "low"
        }
    }

    return endpointsLowPriorityNumber; // On retourne le nombre
  } catch (error) {
    console.error("Erreur lors du comptage du nombre d'endpoints au niveau de dangerisite bas :", error);
    return 0; // Si erreur, retourne 0 pour éviter un crash
  }
}

export default countLowPriorityEndpoints;
