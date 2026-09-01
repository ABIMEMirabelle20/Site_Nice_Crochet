import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import logo from "../ressources/Logo.jpeg";

const LINKS = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'apropos', label: 'À propos' },
  { id: 'formations', label: 'Formations' },
  { id: 'collection', label: 'Collection' },
  { id: 'commander', label: 'Commander' },
];

const THEMES = {
  cream: {
    bg: '#F7EEE0',
    text: '#3D2417',
    muted: '#7A4A32',
    border: 'rgba(212,169,74,.24)',
  },
  chocolate: {
    bg: '#3D2417',
    text: '#F7EEE0',
    muted: '#D4A94A',
    border: 'rgba(212,169,74,.18)',
  },
  terracotta: {
    bg: '#C1694A',
    text: '#FFFDF6',
    muted: '#FFFDF6',
    border: 'rgba(255,253,246,.18)',
  },
};

export default function Navbar({ page, goTo }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('accueil');
  const lastTheme = useRef('cream');
  const lastSection = useRef('accueil');

  const bg = useMotionValue(THEMES.cream.bg);
  const smoothBg = useSpring(bg, { stiffness: 110, damping: 26, mass: 0.8 });

  const text = useMotionValue(THEMES.cream.text);
  const smoothText = useSpring(text, { stiffness: 110, damping: 26, mass: 0.8 });

  const muted = useMotionValue(THEMES.cream.muted);
  const smoothMuted = useSpring(muted, { stiffness: 110, damping: 26, mass: 0.8 });

  const border = useMotionValue(THEMES.cream.border);
  const smoothBorder = useSpring(border, { stiffness: 110, damping: 26, mass: 0.8 });

  const changeTheme = (nextTheme) => {
    const next = THEMES[nextTheme] || THEMES.cream;
    if (lastTheme.current === nextTheme) return;
    lastTheme.current = nextTheme;
    bg.set(next.bg);
    text.set(next.text);
    muted.set(next.muted);
    border.set(next.border);
  };

  useEffect(() => {
    if (page !== 'accueil') {
      setActiveSection(page);
      changeTheme('cream');
      return undefined;
    }

    const sections = [...document.querySelectorAll('#page-accueil .nav-section')];
    if (!sections.length) return undefined;

    const update = () => {
      setScrolled(window.scrollY > 40);

      // La ligne de référence est placée sous la navbar :
      // le thème suit donc réellement ce que l'utilisateur est en train de traverser.
      const probeY = Math.min(window.innerHeight * 0.22, 180);
      let current = sections[0];

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= probeY && rect.bottom > probeY) current = section;
      });

      const nextTheme = current.dataset.navTheme || 'cream';
      changeTheme(nextTheme);

      const id = current.id === 'apropos-section'
        ? 'apropos'
        : current.dataset.navSectionId || (
          current.classList.contains('hero2') ? 'accueil' :
          current.classList.contains('bento-section') ? 'collection' :
          current.classList.contains('formation-cta') ? 'formations' :
          current.classList.contains('testimonials') ? 'accueil' :
          activeSection
        );

      if (id && lastSection.current !== id) {
        lastSection.current = id;
        setActiveSection(id);
      }
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [page]);

  const handleNav = (id) => {
    setMobileOpen(false);

    if (id === 'apropos' && page === 'accueil') {
      document.getElementById('apropos-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      return;
    }

    goTo(id);
  };

  return (
    <>
      <motion.nav
        className={scrolled ? 'scrolled' : ''}
        style={{
          backgroundColor: smoothBg,
          color: smoothText,
          borderBottomColor: smoothBorder,
          '--nav-text': smoothText,
          '--nav-muted': smoothMuted,
          '--nav-border': smoothBorder,
        }}
      >
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
                href={`#${l.id}`}
                className={activeSection === l.id ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(l.id);
                }}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={mobileOpen}
          className={`hamburger ${mobileOpen ? 'open' : ''}`}
          onClick={() => setMobileOpen((value) => !value)}
        >
          <span></span><span></span><span></span>
        </button>
      </motion.nav>

      <motion.div
        className={`mobile-menu ${mobileOpen ? 'open' : ''}`}
        style={{
          backgroundColor: smoothBg,
          color: smoothText,
          borderBottomColor: smoothBorder,
        }}
      >
        <ul>
          {LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                className={activeSection === l.id ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(l.id);
                }}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </motion.div>
    </>
  );
}
