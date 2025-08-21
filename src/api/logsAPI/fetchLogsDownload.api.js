import axios from 'axios';

/**
 * Télécharge un fichier de logs depuis le backend
 * @param {string} logType - Type de log ("history", "access", "app", etc.)
 */
async function fetchLogsDownload(logType) {
  try {
    // 1️⃣ Récupère la session depuis le localStorage
    const session = localStorage.getItem('adminSession');
    if (!session) throw new Error('Session introuvable');

    const { token } = JSON.parse(session);
    if (!token) throw new Error('Token manquant dans la session');

    // 2️⃣ Appelle le backend avec le type de log
    const response = await axios.get(
      `http://${import.meta.env.VITE_API_IP}:${import.meta.env.VITE_API_PORT}/api/logs/download/${logType}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob', // Réponse en flux binaire (fichier)
      }
    );

    // 3️⃣ Crée un lien de téléchargement dans le navigateur
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;

    // Nom du fichier téléchargé (ex: history.log)
    link.setAttribute('download', `${logType}.log`);

    // 4️⃣ Ajout au DOM et clic automatique
    document.body.appendChild(link);
    link.click();

    // 5️⃣ Nettoyage
    link.remove();
    window.URL.revokeObjectURL(url);

    console.log(`✅ Téléchargement du log "${logType}" terminé`);

  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      `Échec du téléchargement du log "${logType}"`;
    console.error(`❌ Erreur fetchLogsDownload (${logType}):`, message);
    throw new Error(message);
  }
}

export default fetchLogsDownload;
