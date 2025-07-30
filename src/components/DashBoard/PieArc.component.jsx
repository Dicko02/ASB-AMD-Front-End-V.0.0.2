import { useState, useEffect } from 'react';

// Import des composants nécessaires depuis MUI X Charts
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import PercentageConvertion from '../../utils/PercentageConvertion';
import Loading from '../Complements/Loading.component';

// Import des fonctions pour compter les endpoints par niveau de dangerosité
import countLowPriorityEndpoints from '../../utils/EndpointPriorityLevelNumber/EndpointLowPriorityNumber';
import countMediumPriorityEndpoints from '../../utils/EndpointPriorityLevelNumber/EndpointMediumPriorityNumber';
import countHighPriorityEndpoints from '../../utils/EndpointPriorityLevelNumber/EndpointHighPriorityNumber';
import countCriticalPriorityEndpoints from '../../utils/EndpointPriorityLevelNumber/EndpointCriticalyPriorityNumber';

function PieArcLabel() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // On compte le nombre d'endpoints pour chaque niveau de dangerosité
      const endpointsLowPriorityNumber = await countLowPriorityEndpoints();
      const endpointsMediumPriorityNumber = await countMediumPriorityEndpoints();
      const endpointsHighPriorityNumber = await countHighPriorityEndpoints();
      const endpointsCriticalPriorityNumber = await countCriticalPriorityEndpoints();

      // On convertit les nombres d'endpoints en pourcentages
      const endpointsLowPriorityPercentage = await PercentageConvertion(endpointsLowPriorityNumber);
      const endpointsMediumPriorityPercentage = await PercentageConvertion(endpointsMediumPriorityNumber);
      const endpointsHighPriorityPercentage = await PercentageConvertion(endpointsHighPriorityNumber);
      const endpointsCriticalPriorityPercentage = await PercentageConvertion(endpointsCriticalPriorityNumber);

      const pieData = [
        { label: 'Low', value: endpointsLowPriorityPercentage, color: '#4CAF50' }, // Vert pour faible priorité
        { label: 'Medium', value: endpointsMediumPriorityPercentage, color: 'yellow' }, // jaune pour priorité moyenne
        { label: 'High', value: endpointsHighPriorityPercentage, color: '#FF9800' }, // Orange pour haute priorité
        { label: 'Critical', value: endpointsCriticalPriorityPercentage, color: '#D32F2F' }, // Rouge foncé pour priorité critique
      ];

      setData(pieData);
      setLoading(false);
    }

    fetchData();
  }, []);

  // Affiche un spinner pendant le chargement
  if (loading) return <Loading text="Chargement du graphique circulaire..." />;

  // Taille du graphique
  const size = {
    width: 315,   // Largeur du PieChart
    height: 315,  // Hauteur du PieChart
  };

  // Composant principal que tu peux utiliser partout dans ton appli
  return (
    <div className="bg-white p-4 rounded-2xl shadow w-full">
      <PieChart
        series={[
          {
            // On fournit les données à représenter
            data: data,

            // On affiche une étiquette sur chaque "tranche" du camembert
            arcLabel: (item) => `${item.label}: ${item.value}%`,

            // Angle minimum requis pour afficher une étiquette
            arcLabelMinAngle: 20, // 20° minimum, sinon pas d'étiquette

            // Rayon à partir duquel le texte est affiché (ici à 60% du rayon)
            arcLabelRadius: '60%',
          },
        ]}

        // Style du texte des labels (gras ici)
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fontWeight: 'bold',
          },
        }}

        // Applique la taille définie plus haut
        {...size}
      />
    </div>
  );
}

export default PieArcLabel;
