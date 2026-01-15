// components/Layout.jsx
import React from 'react';

const Layout = ({ children }) => {
  const handleRefresh = () => {
    window.location.reload();
  };
  return (
    <div style={styles.container}>
      {/* Optional header/navigation */}
      <header style={styles.header}>
        <h1 style={styles.logo}>My Application</h1>
        <nav style={styles.nav}>
          <a href="#home" style={styles.navLink}>Home</a>
          <a href="#test" style={styles.navLink}>Test DB</a>
          <a href="#about" style={styles.navLink}>About</a>
          <button style={{...styles.navLink, cursor: 'pointer', border: 'none', background: 'none'}} onClick={handleRefresh}>
            Refresh
          </button>
        </nav>
      </header>
      {/* Main content area with scroll */}
      <main style={styles.mainContent}>
        {children}
      </main>
      {/* Optional footer */}
      <footer style={styles.footer}>
        <p>© 2024 My Application. All rights reserved.</p>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    backgroundColor: '#2d3748',
    color: 'white',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  logo: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 'bold'
  },
  nav: {
    display: 'flex',
    gap: '20px'
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    transition: 'background-color 0.3s'
  },
  mainContent: {
    flex: 1,
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    overflowY: 'auto' /* This enables scrolling for the main content */
  },
  footer: {
    backgroundColor: '#2d3748',
    color: 'white',
    textAlign: 'center',
    padding: '20px',
    marginTop: 'auto'
  }
};

export default Layout;