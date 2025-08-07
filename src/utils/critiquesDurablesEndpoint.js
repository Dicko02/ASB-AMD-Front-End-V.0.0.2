import fetchCritiquesDurables from '../api/logsAPI/critiquesDurables.api';

async function critiquesDurablesEndpoint(nom) {
    
    try {
        const response = await fetchCritiquesDurables();
        const allCritiquesDurables = response.data;
        console.log("response: ", response);
        console.log("allCritiquesDurables: ", allCritiquesDurables);
        const critiquesDurablesEndpoint = [];

        for(const critiquesDurables of allCritiquesDurables){
            if(nom === critiquesDurables.endpoint){
                console.log('critiquesDurables:', critiquesDurables)
                critiquesDurablesEndpoint.push({
                    endpoint: critiquesDurables.endpoint,
                    niveau: critiquesDurables.niveau,
                    depuis: critiquesDurables.depuis,
                    jusqua: critiquesDurables.jusqua,
                    jours: critiquesDurables.jours
                });

                return critiquesDurables;
            }
        }
      } catch (error) {
        console.error(`Erreur lors de la recherche de <critiquesDurables> pour ${nom}`, error);
      }
}

export default critiquesDurablesEndpoint;