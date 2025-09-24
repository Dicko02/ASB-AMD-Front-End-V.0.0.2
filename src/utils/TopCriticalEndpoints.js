
// Fonction pour obtenir les top N endpoints critiques
function getTopCriticalEndpoints(endpoints = [], critiquesDurables = [], topN = 5, batchSize = 20) {
  
    // Transforme le tableau critiquesDurables en objet indexé par endpoint
  const critiquesMap = Object.fromEntries(
    critiquesDurables.map(item => [item.endpoint, item])
  );

  // Fonction interne pour enrichir les endpoints par lots
  function enrichEndpoints(endpoints, batchSize) {
    const result = [];
    for (let i = 0; i < endpoints.length; i += batchSize) {
      const batch = endpoints.slice(i, i + batchSize);
      const enrichedBatch = batch.map(ep => {
        const nom = ep.CN || ep.Nom;
        const data = critiquesMap[nom] || {};
        return { ...ep, jours: data?.jours || 0 };
      });
      result.push(...enrichedBatch);
    }
    return result;
  }

  const enrichedEndpoints = enrichEndpoints(endpoints, batchSize);

  // Trier selon dangerousityNumber puis jours
  const sorted = enrichedEndpoints.sort((a, b) => {
    if (b.dangerousityNumber !== a.dangerousityNumber) {
      return b.dangerousityNumber - a.dangerousityNumber;
    } else {
      return b.jours - a.jours;
    }
  });

  return sorted.slice(0, topN);
}

export default getTopCriticalEndpoints;