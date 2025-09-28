import { useState, useEffect } from "react";
import getCriticalLevels from "../../api/settingAPI/criticalLevelMaxValue/getcriticalLevelMaxValue.api";
import updateCriticalLevels from "../../api/settingAPI/criticalLevelMaxValue/updateCriticalLevelMaxValue.api";
import Loading from "../Complements/Loading.component";

function CriticalLevelSetting() {
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState(null);
    const [msgVisible, setMsgVisible] = useState(false);
    const [error, setError] = useState(false);

    // Chargement initial
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await getCriticalLevels();
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

    // Changement de valeur
    const handleChange = (key, value) => {
        setFormData((prev) => ({
        ...prev,
        [key]: Number(value) || 0,
        }));
    };

    // Soumission
    const handleSubmit = async (e) => {

        e.preventDefault();
        setLoading(true);

        try {
            await updateCriticalLevels(formData);
            setMsg("✅ Paramètres mis à jour avec succès");
            setError(false);

        } catch (err) {
            setMsg("❌ Erreur lors de la mise à jour : " + err.message);
            setError(true);
        }

        setLoading(false);
        setMsgVisible(true);
        setTimeout(() => setMsgVisible(false), 10000);

    };

    if (loading) return <Loading text="Chargement des paramètres..." />;
    if (!formData)
        return <div style={{ textAlign: "center", color: "red" }}>Aucune donnée trouvée</div>;

    return (
        <div style={{ maxWidth: 400, margin: "2rem auto" }}>
        {msg && msgVisible && (
            <div
                style={{
                    marginBottom: "1rem",
                    padding: "1rem",
                    borderRadius: 6,
                    backgroundColor: error ? "#f8d7da" : "#d4edda",
                    color: error ? "#721c24" : "#155724",
                    fontWeight: 600,
                    textAlign: "center",
                }}
            >
            {msg}
            </div>
        )}

        <form
            onSubmit={handleSubmit}
            style={{
            padding: "1.5rem",
            borderRadius: "1rem",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            backgroundColor: "white",
            }}
        >
            <h3
                style={{ 
                    marginBottom: '1.2rem', 
                    color: '#333', 
                    textAlign: 'center', 
                    fontWeight: '600',
                    fontSize: '1.1rem'
                }}>
                    Donnez la Valeur Maximale de chaque Niveau Critique a appliquer:
            </h3>

            {["lowMaxValue", "mediumMaxValue", "highMaxValue"].map((key) => (
            <label
                key={key}
                style={{ display: "flex", flexDirection: "column", marginBottom: "1rem" }}
            >
                {key}
                <input
                type="number"
                value={formData[key] ?? ""}
                onChange={(e) => handleChange(key, e.target.value)}
                style={{
                    border: "1px solid #ccc",
                    borderRadius: "0.5rem",
                    padding: "0.5rem",
                    width: "100%",
                }}
                />
            </label>
            ))}

            <button
            type="submit"
            style={{
                marginTop: "1rem",
                width: "100%",
                padding: "0.6rem 0",
                borderRadius: 6,
                border: "none",
                backgroundColor: "#007BFF",
                color: "white",
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
            }}
            >
            Soumettre
            </button>
        </form>
        </div>
    );
}

export default CriticalLevelSetting;
