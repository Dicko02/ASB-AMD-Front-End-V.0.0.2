import { useState } from 'react';

export default function SidebarToggle() {
  const [isOpen, setIsOpen] = useState(false);

  function handleLogout(){
    localStorage.removeItem('adminSession');
    window.location.href = '/';
  };

  const handleSettings = () =>{
    window.location.href = '/Setting';
  }

  const adminSessionStr = localStorage.getItem('adminSession'); // chaîne JSON
  const adminSession = JSON.parse(adminSessionStr); // maintenant un objet JS
  const pseudo = adminSession.pseudo;
  const titre = adminSession.titre;
  const SA = "Super Admin"

  let isVisible = false;
  if(titre === SA){
    isVisible = true;
  }


  return (
    <>
      {/* ☰ Bouton d'ouverture flottant */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          zIndex: 50,
          padding: '0.5rem 1rem',
          backgroundColor: 'black',
          color: 'white',
          borderRadius: '0.375rem',
          boxShadow: '0 2px 6px black',
          transition: 'background-color 0.2s ease',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'purple')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'black')}
      >
        ☰
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 40,
          }}
        />
      )}

      {/* Sidebar glissante */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100%',
            width: '16rem',
            backgroundColor: 'white',
            zIndex: 50,
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            transform: 'translateX(0)',
            transition: 'transform 0.3s ease-in-out',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* En-tête */}
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#374151' }}>
                Menu
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  fontSize: '1.5rem',
                  color: '#6b7280',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = '#dc2626')}
                onMouseOut={(e) => (e.currentTarget.style.color = '#6b7280')}
              >
                &times;
              </button>
            </div>

            {/* Liens */}
            <nav
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '1rem',
                gap: '1rem',
              }}
            >
              <a href="/Accueil" style={{ color: '#374151', textDecoration: 'none' }}
                onMouseOver={(e) => (e.currentTarget.style.color = '#2563eb')}
                onMouseOut={(e) => (e.currentTarget.style.color = '#374151')}
              >Accueil</a>

              <a href="/NoAD" style={{ color: '#374151', textDecoration: 'none' }}
                onMouseOver={(e) => (e.currentTarget.style.color = '#2563eb')}
                onMouseOut={(e) => (e.currentTarget.style.color = '#374151')}
              >NoAD</a>

              <a href="/DashBoard" style={{ color: '#374151', textDecoration: 'none' }}
                onMouseOver={(e) => (e.currentTarget.style.color = '#2563eb')}
                onMouseOut={(e) => (e.currentTarget.style.color = '#374151')}
              >Tableau de Bord</a>

              <a href="/UsersManagement" style={{ color: '#374151', textDecoration: 'none', display: isVisible ? 'block' : 'none' }}
                onMouseOver={(e) => (e.currentTarget.style.color = '#2563eb')}
                onMouseOut={(e) => (e.currentTarget.style.color = '#374151')}
              >Liste des Utilisateurs</a>

              <a href="/AddUser" style={{ color: '#374151', textDecoration: 'none', display: isVisible ? 'block' : 'none' }}
                onMouseOver={(e) => (e.currentTarget.style.color = '#2563eb')}
                onMouseOut={(e) => (e.currentTarget.style.color = '#374151')}
              >Ajoute un Utilisateur</a>
            </nav>
          </div>

          {/* Profil Admin + Déconnexion */}
          <div
            style={{
              padding: '1rem',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
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
            <div style={{ flexGrow: 1 }}>
              <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{pseudo}</p>
              <button
                onClick={handleLogout}
                style={{
                  fontSize: '0.8rem',
                  background: 'none',
                  color: '#ef4444',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  marginTop: '0.25rem',
                }}
              >
                Déconnexion
              </button>
            </div>
            {/* Bouton Paramètres */}
            <button
              onClick={handleSettings}
              title="Paramètres"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                fontSize: '1.2rem',
                color: '#6b7280', // gris neutre
              }}
            >
              ⚙️
            </button>
          </div>
        </div>
      )}
    </>
  );
}
