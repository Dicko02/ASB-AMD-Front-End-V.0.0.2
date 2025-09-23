import { useEffect, useState } from "react";
import Loading from "../Complements/Loading.component";
import critiquesDurablesEndpoint from "../../api/logsAPI/critiquesDurables.api";
import getAllEndpoints from "../../api/endpoint/allEndpoints.api";
import { useNavigate } from 'react-router-dom';

function TopCriticalEndpointsCard() {
  const [topEndpoints, setTopEndpoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEndpoints() {
      try {
        const response = await getAllEndpoints();
        const allEndpoints = response.data;

        // Fonction pour enrichir les endpoints avec les jours de criticité durable
        async function enrichEndpoints(endpoints, batchSize) {
            const result = [];
            for (let i = 0; i < endpoints.length; i += batchSize) {
                const batch = endpoints.slice(i, i + batchSize);

                const enrichedBatch = await Promise.all(
                    batch.map(async (ep) => {
                        try {
                            const data = await critiquesDurablesEndpoint(ep.CN || ep.Nom);
                            return { ...ep, jours: data?.jours || 0 };
                        } catch (err) {
                            console.error(`Erreur critiquesDurables pour ${ep.CN || ep.Nom}:`, err);
                            return { ...ep, jours: 0 };
                        }
                    })
                );

                result.push(...enrichedBatch);
            }
            return result;
        };

        // Enrichir les endpoints par lots pour éviter de surcharger le serveur
        const enrichedEndpoints = await enrichEndpoints(allEndpoints, 20);

        // Trier selon dangerousityNumber puis jours
        const sorted = enrichedEndpoints.sort((a, b) => {
            
          if (b.dangerousityNumber !== a.dangerousityNumber){
            return b.dangerousityNumber - a.dangerousityNumber; // tri principal par dangerousityNumber
          }else{
            return b.jours - a.jours; // si égalité, compare par "jours"
          }

        });

        setTopEndpoints(sorted.slice(0, 5)); // garde les 5 premiers

      } catch (err) {
        console.error("Erreur lors du chargement des endpoints critiques :", err);
      } finally {
        setLoading(false);
      }
    }

    fetchEndpoints();
  }, []);

  function viewDescription(nom) {
    navigate(`/Endpoints/${nom}`);
  };

  if (loading) {
    return (
      <Loading text="Chargement du Top 5 des endpoints les plus critiques..." />
    );
  };

  return (
    <div
        style={{
            width: "350px",
            padding: "12px 16px",   // réduit par rapport à 20px
            backgroundColor: "#f9f9f9",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            fontFamily: "sans-serif",
        }}
        >
        <div
            style={{
            fontWeight: "bold",
            marginBottom: "8px",  // réduit
            fontSize: "16px",     // réduit un peu
            textAlign: "center",
            }}
        >
            Top 5 Endpoints Critiques
        </div>

        {topEndpoints.map((ep, index) => (
            <div
            key={ep.id || ep.CN || ep.Nom || index}
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "4px", // réduit
                padding: "6px 10px", // réduit
                backgroundColor: index === 0 ? "#fee2e2" : "#f3f4f6",
                borderRadius: "4px", // réduit
            }}
            >
            <span style={{ fontSize: "13px", fontWeight: "600" }} onClick={() => {
                viewDescription(ep.CN || ep.Nom);
            }}>
                #{index + 1} - {ep.CN || ep.Nom}
            </span>
            <span style={{ color: "red", fontWeight: "700", fontSize: "12px" }}>
                {ep.criticalLevel} ({ep.dangerousityNumber} pts) / {ep.jours}j
            </span>
            </div>
        ))}
        </div>

  );
}

export default TopCriticalEndpointsCard;
