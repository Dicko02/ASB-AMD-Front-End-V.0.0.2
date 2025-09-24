import { useEffect, useState } from "react";
import Loading from "../Complements/Loading.component";
import { useNavigate } from 'react-router-dom';

import getTopCriticalEndpoints from '../../utils/TopCriticalEndpoints';

function TopCriticalEndpointsCard({ allEndpoints, critiquesDurables }) {
  const [topEndpoints, setTopEndpoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEndpoints() {
      try {
        const top5 = getTopCriticalEndpoints(allEndpoints, critiquesDurables);
        setTopEndpoints(top5);
      } catch (err) {
        console.error("Erreur lors du chargement des endpoints critiques :", err);
      } finally {
        setLoading(false);
      }
    }

    fetchEndpoints();
  }, [allEndpoints, critiquesDurables]);

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
        padding: "12px 16px",
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
          marginBottom: "8px",
          fontSize: "16px",
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
            marginBottom: "4px",
            padding: "6px 10px",
            backgroundColor: index === 0 ? "#fee2e2" : "#f3f4f6",
            borderRadius: "4px",
          }}
        >
          <span
            style={{ fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
            onClick={() => viewDescription(ep.CN || ep.Nom)}
          >
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
