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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (id) => {
    goTo(id);
    setMobileOpen(false);
  };

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
                className={page === l.id ? 'active' : ''}
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
