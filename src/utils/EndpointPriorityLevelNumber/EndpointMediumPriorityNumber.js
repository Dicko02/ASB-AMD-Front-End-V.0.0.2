import fetchEndpoints from '../../api/endpoint/allEndpoints.api';
import fetchNoAD from '../../api/noAdAPI/allNoAD.api';

// Fonction pour compter le nombre d'endpoints avec un niveau de dangerosité "medium"
async function countMediumPriorityEndpoints() {
  try {
    const [source1, source2] = await Promise.all([
      fetchEndpoints(), // première source
      fetchNoAD() // deuxième source
    ]);

    // Normalisation en tableaux
    const Endpoints = source1.data || source1 || [];
    const NoADs = source2.data || source2 || [];

    // Fusion
    const endpoints = [...Endpoints, ...NoADs];

    let endpointsMediumPriorityNumber = 0;

    for (const endpoint of endpoints) {
        if(endpoint.criticalLevel === "medium") {
            endpointsMediumPriorityNumber++; // On incrémente le compteur si le niveau de dangerosité est "medium"
        }
    }

    return endpointsMediumPriorityNumber; // On retourne le nombre
  } catch (error) {
    console.error("Erreur lors du comptage du nombre d'endpoints au niveau de dangerisite moyen :", error);
    return 0; // Si erreur, retourne 0 pour éviter un crash
  }
}

export default countMediumPriorityEndpoints;
