import fetchEndpointsNoAD from '../../api/noAdAPI/allNoAD.api';

// Fonction pour compter le nombre d'endpoints n'etant pas dans AD
async function countEndpointsNoAD() {
  try {
    const response = await fetchEndpointsNoAD();
    const endpointsNoAD = response.data;
    const endpointsNoADTotalNumber = endpointsNoAD.length;

    return endpointsNoADTotalNumber; // On retourne le nombre
  } catch (error) {
    console.error("Erreur lors du comptage des endpoints NoAD :", error);
    return 0; // Si erreur, retourne 0 pour éviter un crash
  }
}

export default countEndpointsNoAD;
