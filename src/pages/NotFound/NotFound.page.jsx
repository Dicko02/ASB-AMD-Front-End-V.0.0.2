import './NotFound.css';

function NotFound() {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1>404</h1>
        <h2>Not Found</h2>
        <p>La page que vous cherchez n'existe pas.</p>
        <span className="emoji">😕</span>
        <a href="/DashBoard" className="btn-return">Retour à l'accueil</a>
      </div>
    </div>
  );
}

export default NotFound;
