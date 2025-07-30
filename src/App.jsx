import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loading from './components/Complements/Loading.component';
import PrivateRoute from './utils/PrivateRoute'; 

// Lazy loading des pages
const Accueil = lazy(() => import('./pages/Accueil.page'));
const NoAD = lazy(() => import('./pages/NoAD.page'));
const Endpoint = lazy(() => import('./pages/Endpoint.page'));
const DashBoard = lazy(() => import('./pages/DashBoard.page'));
const UsersModif = lazy(() => import('./pages/User/UserModif.page'));
const UsersManagement = lazy(() => import('./pages/User/UsersManagement.page'));
const UsersAdd = lazy(() => import('./pages/User/UserAdd.page'));
const Setting = lazy(() => import('./pages/Setting.page'));
const Connexion = lazy(() => import('./pages/Connexion.page'))

function App() {
  return (
    <Router>
      {/* Suspense affiche <Loading /> pendant que les pages sont chargées */}
      <Suspense fallback={<Loading text="Chargement de la page..." />}>
          <Routes>
            {/* Page de connexion (publique) */}
          <Route path="/" element={<Connexion />} />

          {/* Page d'accueil (protégée) */}
          <Route path="/Accueil" element={<PrivateRoute><Accueil /></PrivateRoute>}/>
          <Route path="/NoAD" element={<PrivateRoute><NoAD /></PrivateRoute>}/>
          <Route path="/:CN" element={<PrivateRoute><Endpoint /></PrivateRoute>} />
          <Route path="/DashBoard" element={<PrivateRoute><DashBoard /></PrivateRoute>} />
          <Route path="/UsersManagement" element={<PrivateRoute><UsersManagement /></PrivateRoute>} />
          <Route path="/UsersManagement/:id" element={<PrivateRoute><UsersModif /></PrivateRoute>} />
          <Route path="/AddUser" element={<PrivateRoute><UsersAdd /></PrivateRoute>} />
          <Route path="/Setting" element={<PrivateRoute><Setting /></PrivateRoute>} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
