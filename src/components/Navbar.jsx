import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

// Menu plein écran (mobile) : liste resserrée à 4 entrées, "L'atelier"
// et "À propos" fusionnés dans "Notre histoire" (page dédiée), "Sur
// mesure" fusionné dans "Collection".
const FULL_MENU = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'histoire', label: 'À propos · Notre histoire' },
  { id: 'collection', label: "L'atelier · Collection" },
  { id: 'commander', label: 'Commander' },
];

// Icônes inline, réutilisées telles quelles depuis le footer pour la
// cohérence visuelle.
const IconInstagram = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const IconWhatsapp = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.9a9.1 9.1 0 0 0-7.85 13.7L3 21.1l4.6-1.2A9.1 9.1 0 1 0 12 2.9Zm0 1.8a7.3 7.3 0 0 1 6.32 10.98l-.2.34.9 3.28-3.36-.88-.33.2A7.3 7.3 0 1 1 12 4.7Zm-2.7 3.5c-.18 0-.47.07-.72.34-.24.27-.94.9-.94 2.2 0 1.3.96 2.55 1.1 2.72.13.18 1.87 2.98 4.6 4.06 2.28.9 2.74.72 3.24.68.5-.05 1.6-.65 1.83-1.28.22-.63.22-1.17.15-1.28-.06-.1-.24-.17-.5-.3-.26-.13-1.6-.79-1.85-.88-.24-.1-.42-.13-.6.13-.17.27-.68.88-.83 1.06-.15.18-.3.2-.57.07-.26-.13-1.1-.4-2.1-1.3-.78-.68-1.3-1.53-1.46-1.8-.15-.26-.02-.4.11-.54.12-.12.27-.3.4-.46.13-.15.18-.26.27-.44.09-.17.05-.33-.02-.46-.07-.13-.6-1.46-.83-2-.22-.53-.44-.46-.6-.47h-.5Z" />
  </svg>
);
const IconTiktok = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.8 3h-2.6v12.2a2.7 2.7 0 1 1-2.2-2.66v-2.62a5.3 5.3 0 1 0 4.8 5.28V9.1c1 .7 2.2 1.1 3.4 1.1V7.6c-1.86 0-3.4-1.28-3.4-2.9V3Z" />
  </svg>
);

const menuContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};
const menuItem = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

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

      {/* Menu plein écran (mobile) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-fullmenu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="mobile-fullmenu-brand">Nice Création</div>

            <motion.ul
              className="mobile-fullmenu-links"
              initial="hidden"
              animate="visible"
              variants={menuContainer}
            >
              {FULL_MENU.map((l) => (
                <motion.li key={l.id} variants={menuItem}>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); handleNav(l.id); }}
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              className="mobile-fullmenu-socials"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
            >
              <a href="https://www.instagram.com/nice.creation1?igsh=Z3AxdHhsaHE4Mjdv" aria-label="Instagram" target="_blank" rel="noreferrer"><IconInstagram /></a>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} aria-label="WhatsApp" target="_blank" rel="noreferrer"><IconWhatsapp /></a>
              <a href="https://www.tiktok.com/@nicecrochet0?_r=1&_t=ZS-97t2LsEUaTF" aria-label="TikTok" target="_blank" rel="noreferrer"><IconTiktok /></a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}