import getMonth from "./DateMonth";
import fetchEndpoints from '../../api/endpoint/allEndpoints.api';
import fetchNoAD from '../../api/noAdAPI/allNoAD.api';
import Mois from './MonthModel';

async function AllCriticalyNumberPerMonth() {
  try {
    const Months = [
      "janvier", "fevrier", "mars", "avril", "mai", "juin",
      "juillet", "aout", "septembre", "octobre", "novembre", "decembre"
    ];

    const allMonthCritalyLevels = Months.map(nom => new Mois({ nom }));

    const [source1, source2] = await Promise.all([
      fetchEndpoints(), // première source
      fetchNoAD() // deuxième source
    ]);

    // Normalisation en tableaux
    const Endpoints = source1.data || source1 || [];
    const NoADs = source2.data || source2 || [];

    // Fusion
    const endpoints = [...Endpoints, ...NoADs];

    for (const endpoint of endpoints) {
      // 🛡️ Vérifie que la date existe et est une string
      if (!endpoint.updatedAt || typeof endpoint.updatedAt !== 'string') {
        console.warn("Date manquante ou invalide pour endpoint :", endpoint);
        continue;
      }

      const endpointMonth = getMonth(endpoint.updatedAt);
      const endpointCriticalyLevel = endpoint.criticalLevel;

      for (const MonthCritalyLevels of allMonthCritalyLevels) {
        if (MonthCritalyLevels.nom === endpointMonth) {
          switch (endpointCriticalyLevel) {
            case "low":
              MonthCritalyLevels.low++;
              break;
            case "medium":
              MonthCritalyLevels.medium++;
              break;
            case "high":
              MonthCritalyLevels.high++;
              break;
            case "critical":
              MonthCritalyLevels.critical++;
              break;
            default:
              console.warn("Criticité inconnue :", endpointCriticalyLevel);
          }
        }
      }
    }

    return allMonthCritalyLevels;

  } catch (error) {
    console.error("Erreur lors de la détermination critique en fonction des mois :", error);
    return [];
  }
}

export default AllCriticalyNumberPerMonth;
