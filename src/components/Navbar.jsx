import { useEffect, useState } from 'react';
import logo from "../ressources/Logo.jpeg";

const LINKS = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'apropos', label: 'À propos' },
  { id: 'formations', label: 'Formations' },
  { id: 'collection', label: 'Collection' },
  { id: 'commander', label: 'Commander' },
];

export default function Navbar({ page, goTo }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Sur l'accueil, "À propos" n'est plus une page à part mais une section :
  // on la surligne quand elle est visible sous la navbar.
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
      const navOffset = 110; // hauteur navbar + marge

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
    goTo(id);
    setMobileOpen(false);
  };

  const isActive = (id) => activeSection === id;

  return (
    <>
      <nav className={scrolled ? 'scrolled' : ''}>
        <div className="nav-brand" onClick={() => handleNav('accueil')}>
         <div className="nav-brand-icon">
    <img src={logo} alt="Nice Crochet" />
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
        <div className={`hamburger ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(!mobileOpen)}>
          <span></span><span></span><span></span>
        </div>
      </nav>
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <ul>
          {LINKS.map((l) => (
            <li key={l.id}>
              <a href="#" onClick={(e) => { e.preventDefault(); handleNav(l.id); }}>{l.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}