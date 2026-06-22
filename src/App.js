import React, { useState, useEffect } from 'react';
import './App.css';
import DarkVeil from './components/DarkVeil';


import StaggeredMenu from './components/StaggeredMenu';
import HomePage from './components/HomePage';
import ToolPage from './components/ToolPage';
import FeaturesPage from './components/FeaturesPage';

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to Home Page', link: '#/' },
  { label: 'Analyze', ariaLabel: 'Go to Tool Page', link: '#/tool' },
  { label: 'Features', ariaLabel: 'Go to Features Page', link: '#/features' }
];

const socialItems = [
  { label: 'Twitter', link: 'https://twitter.com' },
  { label: 'GitHub', link: 'https://github.com' },
  { label: 'LinkedIn', link: 'https://linkedin.com' }
];

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const theme = 'dark';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/tool') {
        setCurrentPage('tool');
      } else if (hash === '#/features') {
        setCurrentPage('features');
      } else {
        setCurrentPage('home');
      }
      // Scroll to top on page switch
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // check initial hash

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="App" style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Fixed Full-Screen Interactive Canvas Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <DarkVeil
          hueShift={0}
          noiseIntensity={0}
          scanlineIntensity={0}
          speed={0.5}
          scanlineFrequency={0}
          warpAmount={0}
        />
      </div>

      <div className="cyber-grid" />
      <div className="ambient-light" />
      <div className="ambient-light-bottom" />

      {/* Top Header Glow Bar */}
      <header className="header-bar" style={{ position: 'relative', zIndex: 10 }} />

      {/* Brand Logo / Name in top left corner */}
      <a 
        href="#/" 
        style={{
          position: 'fixed',
          top: '22px',
          left: '32px',
          zIndex: 50,
          fontFamily: 'var(--font-display)',
          fontSize: '1.2rem',
          fontWeight: 500,
          color: 'var(--text-primary)',
          letterSpacing: '-0.3px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textDecoration: 'none',
          pointerEvents: 'auto'
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L3 18H21L12 2Z" fill="url(#falcon-logo-gradient)" />
          <path d="M12 7L6 17H18L12 7Z" fill="var(--bg-primary)" style={{ transition: 'fill var(--transition-normal)' }} />
          <path d="M12 10L9 15H15L12 10Z" fill="url(#falcon-logo-gradient-inner)" />
          <defs>
            <linearGradient id="falcon-logo-gradient" x1="3" y1="2" x2="21" y2="18" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#5227FF" />
            </linearGradient>
            <linearGradient id="falcon-logo-gradient-inner" x1="9" y1="10" x2="15" y2="15" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#A78BFA" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
        </svg>
        <span style={{ fontWeight: '600' }}>Falcon-N5</span>
      </a>



      {/* Staggered Navigation Menu Overlay (mounted at top level, fixed) */}
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={false}
        displayItemNumbering={false}
        menuButtonColor={theme === 'dark' ? '#ffffff' : '#000000'}
        openMenuButtonColor={theme === 'dark' ? '#ffffff' : '#000000'}
        changeMenuColorOnOpen={true}
        colors={['#B497CF', '#5227FF']}
        logoUrl=""
        accentColor="#5227FF"
        isFixed={true}
      />

      {/* Page Routing Contents */}
      <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        {currentPage === 'home' && <HomePage theme={theme} />}
        {currentPage === 'tool' && <ToolPage theme={theme} />}
        {currentPage === 'features' && <FeaturesPage theme={theme} />}
      </main>

      {/* Footer Tagline Section */}
      <footer style={{
        textAlign: 'center',
        padding: '30px 20px',
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
        fontFamily: 'var(--font-display)',
        letterSpacing: '1px',
        borderTop: '1px solid var(--border-color)',
        background: 'var(--bg-secondary)',
        position: 'relative',
        zIndex: 5,
        marginTop: '60px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <span>© 2026 FALCON-N5 CORE LABS.</span>
        </div>
      </footer>

    </div>
  );
}

export default App;
