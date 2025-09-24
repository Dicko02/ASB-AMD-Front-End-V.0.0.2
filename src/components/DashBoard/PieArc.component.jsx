import { useState, useEffect } from 'react';

// Import des composants nécessaires depuis MUI X Charts
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import PercentageConvertion from '../../utils/PercentageConvertion';
import Loading from '../Complements/Loading.component';

function PieArcLabel({totalEndpoints, lowEndpoints, mediumEndpoints, highEndpoints, criticalEndpoints}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // États pour chaque statistique
  const [total, setTotal] = useState(0);
  const [low, setLow] = useState(0);
  const [medium, setMedium] = useState(0);
  const [high, setHigh] = useState(0);
  const [critical, setCritical] = useState(0);

  useEffect(() => {
    async function fetchData() {

      // On utilise les props passées pour définir les états
      setTotal(totalEndpoints);
      setLow(lowEndpoints);
      setMedium(mediumEndpoints);
      setHigh(highEndpoints);
      setCritical(criticalEndpoints);

      // On convertit les nombres d'endpoints en pourcentages
      const endpointsLowPriorityPercentage = await PercentageConvertion(low, total);
      const endpointsMediumPriorityPercentage = await PercentageConvertion(medium, total);
      const endpointsHighPriorityPercentage = await PercentageConvertion(high, total);
      const endpointsCriticalPriorityPercentage = await PercentageConvertion(critical, total);

      const pieData = [
        { label: 'Faible', value: endpointsLowPriorityPercentage, color: '#4CAF50' }, // Vert pour faible priorité
        { label: 'Modéré', value: endpointsMediumPriorityPercentage, color: 'yellow' }, // jaune pour priorité moyenne
        { label: 'Haut', value: endpointsHighPriorityPercentage, color: '#FF9800' }, // Orange pour haute priorité
        { label: 'Critique', value: endpointsCriticalPriorityPercentage, color: '#D32F2F' }, // Rouge foncé pour priorité critique
      ];

      setData(pieData);
      setLoading(false);
    }

    fetchData();
  }, [total, low, medium, high, critical, totalEndpoints, lowEndpoints, mediumEndpoints, highEndpoints, criticalEndpoints]);

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
