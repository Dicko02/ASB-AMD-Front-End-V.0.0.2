import { useState, useEffect } from "react";
import OneDangerosityNumber from "./OneDangerosityNumber.component";
import getDangerosityNumber from '../../api/settingAPI/ConformityDangerosityNumber/getDangerosityNumber.api';
import updateDangerosityNumber from '../../api/settingAPI/ConformityDangerosityNumber/updateDangerosityNumber.api';
import Loading from '../Complements/Loading.component';

function AllDangerosityNumber() {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);
  const [msgVisible, setMsgVisible] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getDangerosityNumber();
        // Prendre le premier objet du tableau renvoyé
        const data = response.data?.[0] || {};
        setFormData(data);
      } catch (err) {
        setMsg("❌ Erreur de chargement : " + err.message);
        setError(true);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleArrayChange = (section, key, value, index = 0) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].map((item, i) =>
        i === index ? { ...item, [key]: Number(value) || 0 } : item
      ),
    }));
  };

  const handleSimpleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: Number(value) || 0,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateDangerosityNumber(formData);
      setMsg("✅ Paramètres mis à jour avec succès");
      setError(false);
    } catch (err) {
      setMsg("❌ Erreur lors de la mise à jour : " + err.message);
      setError(true);
    }
    setLoading(false);
    setMsgVisible(true);
    setTimeout(() => setMsgVisible(false), 3000);
  };

  const renderArrayInputs = (section) => {
    const arr = formData[section] || [];
    return arr.map((item, idx) => (
      <div
        key={idx}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(100px,1fr))",
          gap: "0.75rem",
          marginBottom: "0.5rem",
        }}
      >
        {Object.keys(item).map((key) => {
          if (key === "_id") return null; // <-- ne rien afficher pour _id

          return (
            <label
              key={key}
              style={{ display: "flex", flexDirection: "column" }}
            >
              {key}
              <input
                type="number"
                value={item[key] ?? ""}
                onChange={(e) =>
                  handleArrayChange(section, key, e.target.value, idx)
                }
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "0.5rem",
                  padding: "0.5rem",
                  width: "100%",
                }}
              />
            </label>
          );
        })}

      </div>
    ));
  };

  if (loading) return <Loading text="Chargement des paramètres..." />;
  if (!formData)
    return (
      <div style={{ textAlign: "center", color: "red" }}>
        Aucune donnée trouvée
      </div>
    );

  return (
    <>
      {msg && msgVisible && (
        <div
          style={{
            position: 'fixed',
            top: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: error ? '#f8d7da' : '#d4edda',
            color: error ? '#721c24' : '#155724',
            padding: '1rem 2rem',
            borderRadius: 6,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            zIndex: 1000,
            fontWeight: 600,
            fontSize: '1rem',
            opacity: msgVisible ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
          }}
        >
          {msg}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          width: "400px",
          padding: "1.5rem",
          borderRadius: "1rem",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          backgroundColor: "white",
          margin: "2rem auto",
        }}
      >
        {[
          "AntivirusActif",
          "AntivirusAJour",
          "BadLogonCount",
          "DerniereConnexionUtilisateur",
          "DisqueChiffre",
          "NomDeMachineConforme",
          "PareFeuActive",
          "VolumesPourcentageLibreSuffisant",
        ].map((section) => (
          <OneDangerosityNumber key={section} title={section}>
            {renderArrayInputs(section)}
          </OneDangerosityNumber>
        ))}

        <OneDangerosityNumber title="Paramètres Globaux">
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {["NoAD", "NoGLPI", "NoKaspersky"].map((key) => (
              <label key={key} style={{ display: "flex", flexDirection: "column" }}>
                {key}
                <input
                  type="number"
                  value={formData[key] ?? ""}
                  onChange={(e) => handleSimpleChange(key, e.target.value)}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "0.5rem",
                    padding: "0.5rem",
                    width: "100%",
                  }}
                />
              </label>
            ))}
          </div>
        </OneDangerosityNumber>

        <button
          type="submit"
          style={{
            marginTop: '1.5rem',
            width: '100%',
            padding: '0.6rem 0',
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#007BFF',
            color: 'white',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#0056b3'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#007BFF'}
        >
          Soumettre
        </button>
      </form>
    </>
  );
}

export default AllDangerosityNumber;
