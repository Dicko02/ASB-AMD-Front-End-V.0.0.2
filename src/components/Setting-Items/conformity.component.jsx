import { useState, useEffect } from 'react';
import updateConformityTable from '../../api/settingAPI/ConformitySetting/updateConformity.api';
import getConformityTable from '../../api/settingAPI/ConformitySetting/getConformity.api';
import Loading from '../Complements/Loading.component';

function ConformitySettingCheckboxForm() {
    // options : label à afficher + valeur réelle à récupérer au submit
    const options = [
        { label: 'Antivirus Actif', value: 'AntivirusActif' },
        { label: 'Antivirus À Jour', value: 'AntivirusAJour' },
        { label: 'Date de Dernière Connexion Utilisateur', value: 'DerniereConnexionUtilisateur' },
        { label: 'Disque Chiffré', value: 'DisqueChiffre' },
        { label: 'Nom De Machine Conforme', value: 'NomDeMachineConforme' },
        { label: 'Pare-Feu Actif', value: 'PareFeuActive' },
        { label: 'Volume en % d\'espace Libre Suffisant', value: 'VolumesPourcentageLibreSuffisant' },
        { label: 'Nombre de mauvaise connection', value: 'BadLogonCount' }
    ];

    const [selectedValues, setSelectedValues] = useState([]);
    const [showMessage, setShowMessage] = useState(false);
    const [messageVisible, setMessageVisible] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Chargement des conformités existantes et cochage par défaut
    useEffect(() => {
        async function loadConformity() {
            try {
                const response = await getConformityTable();
                // Récupère le tableau de conformités depuis l'API
                const initialValues = response.data?.conformityToCheck || [];
                setSelectedValues(initialValues);
            } catch (error) {
                console.error("Erreur lors du chargement des conformités:", error.message);
            }
        }
        loadConformity();
    }, []);

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;

        if (checked) {
            setSelectedValues((prev) => [...prev, value]);
        } else {
            setSelectedValues((prev) => prev.filter((val) => val !== value));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true); // 🔵 Commence le chargement

        try {
            await updateConformityTable({ selectedValues });
            setIsError(false);
            setShowMessage('✅ Changement Appliqué');
        } catch (error) {
            setIsError(true);
            setShowMessage(`❌ ${error.message}`);
        }

        setTimeout(() => setMessageVisible(true), 10);
        setTimeout(() => {
            setMessageVisible(false);
            setTimeout(() => setShowMessage(false), 500);
        }, 3000);

        setIsLoading(false); // 🟢 Fin du chargement
    };

    if (isLoading) {
        return <Loading text="Mise à jour en cours..." />;
    }

    return (
        <>
            {showMessage && (
                <div
                    style={{
                        position: 'fixed',
                        top: '1rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: isError ? '#f8d7da' : '#d4edda',
                        color: isError ? '#721c24' : '#155724',
                        padding: '1rem 2rem',
                        borderRadius: 6,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        zIndex: 1000,
                        fontWeight: '600',
                        fontSize: '1rem',
                        opacity: messageVisible ? 1 : 0,
                        transition: 'opacity 0.5s ease-in-out',
                    }}
                >
                    ✅ Changement Appliqué
                </div>
            )}

            <form 
                onSubmit={handleSubmit}
                style={{
                    maxWidth: 400,
                    maxHeight: 500,
                    margin: '2rem auto',
                    padding: '1.5rem 2rem',
                    borderRadius: 8,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    backgroundColor: '#f9f9f9',
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                }}
            >
                <h3
                    style={{ 
                        marginBottom: '1.2rem', 
                        color: '#333', 
                        textAlign: 'center', 
                        fontWeight: '600'
                    }}
                >
                    Choisissez les conformites a applique :
                </h3>
                {options.map(({ label, value }) => (
                    <div key={value}>
                    <label
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0.5rem 0',
                            cursor: 'pointer',
                            userSelect: 'none',
                            borderRadius: 4,
                            transition: 'background-color 0.2s ease',
                        }}

                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e6f7ff'}

                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <input
                            type="checkbox"
                            value={value} // valeur soumise
                            onChange={handleCheckboxChange}
                            checked={selectedValues.includes(value)}
                            style={{
                                marginRight: 12,
                                width: 18,
                                height: 18,
                                cursor: 'pointer',
                            }}
                        />
                        {/* affichage = label lisible */}
                        <span style={{ fontSize: 16, color: '#555' }}>{label}</span>
                    </label>
                    </div> ))}

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
                        fontWeight: '600',
                        fontSize: 16,
                        cursor: selectedValues.length === 0 ? 'not-allowed' : 'pointer',
                        opacity: selectedValues.length === 0 ? 0.6 : 1,
                        transition: 'background-color 0.3s ease',
                    }}

                    disabled={selectedValues.length === 0}

                    onMouseEnter={e => {
                        if(selectedValues.length !== 0) e.currentTarget.style.backgroundColor = '#0056b3';
                    }}

                    onMouseLeave={e => {
                        if(selectedValues.length !== 0) e.currentTarget.style.backgroundColor = '#007BFF';
                    }}
                >
                    Soumettre
                </button>
            </form>
        </>
    );
}

export default ConformitySettingCheckboxForm;
