import getMonth from "./DateMonth";
import fetchEndpoints from '../../api/endpoint/allEndpoints.api';
import Mois from './MonthModel';

async function AllCriticalyNumberPerMonth() {
  try {
    const Months = [
      "janvier", "fevrier", "mars", "avril", "mai", "juin",
      "juillet", "aout", "septembre", "octobre", "novembre", "decembre"
    ];

    const allMonthCritalyLevels = Months.map(nom => new Mois({ nom }));

    const source = await fetchEndpoints();

    // Normalisation en tableaux
    const endpoints = source.data || [];

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
