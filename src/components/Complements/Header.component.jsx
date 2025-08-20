
function Header({ title = "Tableau de bord" }) {
  const adminSessionStr = localStorage.getItem('adminSession'); // chaîne JSON
  const adminSession = JSON.parse(adminSessionStr); // maintenant un objet JS
  const pseudo = adminSession.pseudo;
  const titre = adminSession.titre;

  return (
    <header
      style={{
        backgroundColor: '#ffffff',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}
    >
      {/* Logo + nom de l'appli */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <img
          src="/cms.svg"
          alt="Logo entreprise"
          style={{
            height: '50px',
            width: '50px',
            objectFit: 'contain',
          }}
        />
        <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1f2937' }}>
          ABS-AMD
        </span>
      </div>

      {/* Titre dynamique */}
      <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#374151' }}>
        {title}
      </h1>

      {/* Profil Admin */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{pseudo}</span>
        <img
          src={`https://ui-avatars.com/api/?name=${titre}`}
          alt="profil"
          style={{
            width: 40,
            height: 40,
            borderRadius: '10000px',
            objectFit: 'cover',
          }}
        />
      </div>
    </header>
  );
}

export default Header;
