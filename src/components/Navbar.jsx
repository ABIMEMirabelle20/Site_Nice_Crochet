import { useEffect, useState } from 'react';
import logo from "../ressources/Logo.jpeg";

const LINKS = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'apropos', label: 'À propos' },
  { id: 'formations', label: 'Formations' },
  { id: 'collection', label: 'Collection' },
  { id: 'commander', label: 'Commander' },
];

// Sur mobile, "Commander" est remplacé par une icône panier à côté du
// hamburger : on ne l'affiche donc plus dans le menu déroulant mobile,
// pour éviter le doublon.
const MOBILE_LINKS = LINKS.filter((l) => l.id !== 'commander');

export default function Navbar({ page, goTo, cartCount = 0, onCartClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('accueil');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);

      if (page !== 'accueil') return;

      const el = document.getElementById('apropos-section');
      if (!el) {
        setActiveSection('accueil');
        return;
      }

      const rect = el.getBoundingClientRect();
      const navOffset = 110;
      const isInSection = rect.top <= navOffset && rect.bottom > navOffset;
      setActiveSection(isInSection ? 'apropos' : 'accueil');
    };

    window.addEventListener('scroll', onScroll);
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, [page]);

  useEffect(() => {
    if (page !== 'accueil') {
      setActiveSection(page);
    }
  }, [page]);

  const handleNav = (id) => {
    setMobileOpen(false);

    if (id === 'apropos' && page === 'accueil') {
      document.getElementById('apropos-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    goTo(id);
  };

  const handleCartClick = () => {
    if (onCartClick) {
      onCartClick();
    } else {
      // Repli si le panier latéral n'est pas encore branché depuis App.jsx.
      goTo('commander');
    }
  };

  const isActive = (id) => activeSection === id;

  return (
    <>
      <nav className={scrolled ? 'scrolled' : ''}>
        <div className="nav-brand" onClick={() => handleNav('accueil')}>
          <div className="nav-brand-icon">
            <img src={logo} alt="Nice Création" />
          </div>
          <div>
            <div className="nav-brand-text">Nice Création</div>
            <div className="nav-brand-sub">Fait main · Chic · Durable</div>
          </div>
        </div>

        <ul className="nav-links">
          {LINKS.map((l) => (
            <li key={l.id}>
              <a
                href="#"
                className={isActive(l.id) ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); handleNav(l.id); }}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Icône panier — visible uniquement sur mobile (voir CSS),
            remplace le lien texte "Commander" à cet endroit. */}
        <button
          className="nav-cart-btn"
          aria-label="Voir mon panier"
          onClick={handleCartClick}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
            <path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="9.5" cy="20.5" r="1.4" />
            <circle cx="17.5" cy="20.5" r="1.4" />
          </svg>
          {cartCount > 0 && <span className="nav-cart-badge">{cartCount}</span>}
        </button>

        <div className={`hamburger ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(!mobileOpen)}>
          <span></span><span></span><span></span>
        </div>
      </nav>

      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <ul>
          {MOBILE_LINKS.map((l) => (
            <li key={l.id}>
              <a
                href="#"
                className={isActive(l.id) ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); handleNav(l.id); }}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}