import { useEffect, useState } from 'react';
import logo from "../ressources/Logo.jpeg";
import { WHATSAPP_NUMBER } from '../data';

// Nav desktop : inchangée, pour ne rien casser de la détection de
// section active existante.
const LINKS = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'apropos', label: 'À propos' },
  { id: 'formations', label: 'Formations' },
  { id: 'collection', label: 'Collection' },
  { id: 'commander', label: 'Commander' },
];

// Menu plein écran (mobile) : plus riche, à la manière d'un mega-menu —
// certaines entrées pointent vers la même section (L'Atelier / À propos)
// puisque le contenu réel ne les distingue pas encore.
const FULL_MENU = [
  { id: 'collection', label: 'Collection' },
  { id: 'suremesure', label: 'Sur mesure' },
  { id: 'apropos', label: "L'atelier" },
  { id: 'formations', label: 'Formations' },
  { id: 'apropos', label: 'À propos' },
  { id: 'contact', label: 'Contact' },
];

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

  // Empêche le scroll du body pendant que le menu plein écran est ouvert.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const scrollToSection = (sectionId) => {
    if (page === 'accueil') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    setActiveSection('accueil');
    goTo('accueil');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  };

  const handleNav = (id) => {
    setMobileOpen(false);

    if (id === 'apropos') {
      scrollToSection('apropos-section');
      return;
    }

    if (id === 'suremesure') {
      scrollToSection('suremesure-section');
      return;
    }

    if (id === 'contact') {
      window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank');
      return;
    }

    goTo(id);
  };

  const handleCartClick = () => {
    setMobileOpen(false);
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

      {/* Menu plein écran (mobile) : grandes lettres, beaucoup d'espace. */}
      <div className={`mobile-fullmenu ${mobileOpen ? 'open' : ''}`}>
        <div className="mobile-fullmenu-brand">Nice Création</div>

        <ul className="mobile-fullmenu-links">
          {FULL_MENU.map((l, i) => (
            <li key={`${l.id}-${i}`}>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); handleNav(l.id); }}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="mobile-fullmenu-socials">
          <a href="https://www.instagram.com/nice.creation1?igsh=Z3AxdHhsaHE4Mjdv" target="_blank" rel="noreferrer">Instagram</a>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">WhatsApp</a>
          <a href="https://www.tiktok.com/@nicecrochet0?_r=1&_t=ZS-97t2LsEUaTF" target="_blank" rel="noreferrer">TikTok</a>
        </div>
      </div>
    </>
  );
}