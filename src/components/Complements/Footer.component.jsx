function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#ffffff',
        padding: '1rem 1.5rem',
        //borderRadius: '8px',
        boxShadow: '0 -2px 4px rgba(0,0,0,0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        bottom: 0,
        zIndex: 30,
      }}
    >
      {/* Texte à gauche */}
      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
        2025 © CMS.
      </span>

      {/* Texte à droite */}
      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
        Conception & Développement par ASB-AMD
      </span>
    </footer>
  );
}

export default Footer;
