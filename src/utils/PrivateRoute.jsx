import { Navigate } from 'react-router-dom';

// Ce composant sert à protéger des pages sensibles (comme la page d'accueil)
// Il vérifie si une session admin existe dans le localStorage
function PrivateRoute({ children }) {
  const adminSession = localStorage.getItem('adminSession');
  // Si une session existe, on affiche la page protégée (children)
  // Sinon, on redirige vers la page de connexion
  if (!adminSession) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
