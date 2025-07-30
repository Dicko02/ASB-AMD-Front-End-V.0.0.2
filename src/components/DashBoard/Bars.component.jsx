import { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import Loading from '../Complements/Loading.component';

import AllCriticalyNumberPerMonth from '../../utils/CriticatlyLevelNumberAndDate/AllCriticalyNumberPerMonth';

const formatValeur = (val) => `${val} endpoints`;

const chartSettings = {
  height: 350,
  yAxis: [
    {
      label: 'Nombre d\'endpoints',
      width: 100,
    },
  ],
};

function BarChartEndpoints() {
  const [loading, setLoading] = useState(true);
  const [dataset, setDataset] = useState([]);

  useEffect(() => {
    // Appel des données asynchrones
    async function fetchData() {
      try {
        const CriticalyNumbers = await AllCriticalyNumberPerMonth();

        const newDataset = CriticalyNumbers.map((item) => ({
          mois: item.nom,
          faibles: item.low,
          modérés: item.medium,
          hauts: item.high,
          critiques: item.critical,
        }));

        setDataset(newDataset);
      } catch (error) {
        console.error('Erreur lors de la génération du dataset :', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <Loading text="Chargement des données du graphique..." />;

  return (
    <div className="bg-white p-4 rounded-2xl shadow w-full">
      <h2 className="text-xl font-semibold text-center mb-4 text-gray-700">
        Répartition des endpoints par criticité
      </h2>
      <BarChart
        dataset={dataset}
        xAxis={[{ dataKey: 'mois' }]}
        series={[
          {
            dataKey: 'critiques',
            label: 'Critique',
            valueFormatter: formatValeur,
            color: 'red',
          },
          {
            dataKey: 'hauts',
            label: 'Haut',
            valueFormatter: formatValeur,
            color: 'orange',
          },
          {
            dataKey: 'modérés',
            label: 'Modéré',
            valueFormatter: formatValeur,
            color: 'yellow',
          },
          {
            dataKey: 'faibles',
            label: 'Faible',
            valueFormatter: formatValeur,
            color: 'green',
          },
        ]}
        {...chartSettings}
      />
    </div>
  );
}

export default BarChartEndpoints;
