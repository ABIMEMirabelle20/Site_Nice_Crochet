import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FooterFull } from '../components/Footer';
import heroImage from "../ressources/photo14.jpg";
import storyImage from "../ressources/photo7.jpg";

// L'image du hero change automatiquement, en fondu-enchaîné continu.
// Ajoute d'autres imports ici et pousse-les dans ce tableau pour
// enrichir la rotation.
const heroImages = [heroImage, storyImage];

// Bande de motifs qui défile en continu sous le manifeste.
const motifItems = [
  { icon: '🧶', label: '100% fait main' },
  { icon: '★', label: 'Note 5/5' },
  { icon: '✂️', label: '+200 clientes satisfaites' },
  { icon: '🪡', label: 'Séries limitées' },
];

// Processus de commande — timeline compacte (horizontale sur desktop,
// verticale sur mobile, cf. CSS).
const processSteps = [
  { num: '01', title: 'Choisir', sub: 'Collection ou sur-mesure' },
  { num: '02', title: 'Personnaliser', sub: 'Taille, couleur, mesures' },
  { num: '03', title: 'Livrer', sub: 'Création soigneusement emballée' },
];

// Les pièces signature — sélection volontairement limitée (esprit
// boutique plutôt que catalogue).
const creations = [
  {
    id: 'robe-crochet-ivoire',
    name: 'Robe Ivoire',
    subtitle: 'Pièce faite main',
    price: 15000,
    tag: 'Nouveauté',
    emoji: '🌿',
    material: 'crochet',
  },
  {
    id: 'top-crochet-elegant',
    name: 'Top Crochet Élégant',
    subtitle: 'Pièce faite main',
    price: 8000,
    tag: 'Best-seller',
    emoji: '🎀',
    material: 'crochet',
  },
  {
    id: 'ensemble-deux-pieces',
    name: 'Ensemble Deux Pièces',
    subtitle: 'Pièce faite main',
    price: 20000,
    tag: 'Édition limitée',
    emoji: '✨',
    material: 'crochet',
  },
  {
    id: 'sac-wax-tresse',
    name: 'Sac Wax Tressé',
    subtitle: 'Accessoire fait main',
    price: 12000,
    tag: 'Accessoire',
    emoji: '🧺',
    material: 'wax',
  },
];

// Collection 2026 — éditions thématiques. Les visuels ci-dessous sont
// des dégradés d'exemple : à remplacer par de vraies photos une fois
// les groupes de pièces/inspiration réunis par thème.
const editions = [
  {
    name: 'Terre & Lumière',
    story: "Des teintes minérales, inspirées des sols ocres du Bénin.",
    palette: 'linear-gradient(135deg,#C99B3B,#B9684D)',
    count: 6,
  },
  {
    name: 'Bleu Atlantique',
    story: "Un hommage à la côte, entre indigo profond et écume claire.",
    palette: 'linear-gradient(135deg,#2E3A59,#A9C6E0)',
    count: 5,
  },
];

// Ce que le savoir-faire garantit — extrait en section autonome.
const craftValues = [
  { icon: '🪡', title: 'Fait main, pièce par pièce', desc: 'Chaque maille est travaillée à la main, sans exception.' },
  { icon: '♻️', title: 'Matières choisies, durables', desc: 'Des fils sélectionnés pour leur qualité et leur tenue dans le temps.' },
  { icon: '🎁', title: 'Séries limitées, uniques', desc: "Peu d'exemplaires, jamais de production de masse." },
];

// Témoignages — mixtes (la clientèle n'est pas exclusivement féminine).
const testimonialsData = [
  { text: "Les créations de Nice Création sont incroyables ! Raffinées, élégantes, et faites avec amour.", author: 'Aïcha B.', initial: 'A' },
  { text: "Commande reçue très rapidement. Service top et qualité parfaitement au rendez-vous. Je recommande !", author: 'Mariam T.', initial: 'M' },
  { text: "Un cadeau pour ma compagne qui a fait sensation. Le souci du détail est impressionnant.", author: 'Kévin A.', initial: 'K' },
  { text: "Ma robe sur mesure est exactement ce que j'avais imaginé, en encore mieux. Une vraie pépite béninoise.", author: 'Fatou D.', initial: 'F' },
];

const reveal = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

// Entrée du hero : orchestrée une seule fois au chargement (animate, pas
// whileInView) puisque le hero est visible dès l'arrivée sur la page.
const heroContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } }
};
const heroItem = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } }
};

export default function Home({ goTo, addToCart }) {
  const trackRef = useRef(null);
  const [heroIdx, setHeroIdx] = useState(0);

  // Rotation automatique de l'image de fond du hero.
  useEffect(() => {
    const id = setInterval(() => {
      setHeroIdx((i) => (i + 1) % heroImages.length);
    }, 5500);
    return () => clearInterval(id);
  }, []);

  // Effet "machine à écrire" pour "Bienvenue chez Nice Création",
  // piloté en JS lettre par lettre : la largeur suit naturellement le
  // texte déjà tapé, donc jamais de coupure ni de débordement, quelle
  // que soit la taille d'écran ou la police.
  const welcomeText = 'Bienvenue chez Nice Création';
  const [typedWelcome, setTypedWelcome] = useState('');

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTypedWelcome(welcomeText.slice(0, i));
      if (i >= welcomeText.length) clearInterval(id);
    }, 70);
    return () => clearInterval(id);
  }, []);

  const handleAddToCart = (product) => {
    if (!addToCart) {
      console.error("La fonction addToCart n'est pas disponible.");
      return;
    }
    addToCart({
      ...product,
      taille: '',
      couleur: '',
      couleurAutre: '',
      notes: '',
      quantity: 1,
    });
    goTo('commander');
  };

  const slideTestimonials = (dir) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: dir * 340, behavior: 'smooth' });
  };

  // "Commencer mon projet" (section Sur mesure) : renvoie vers Commander
  // et ouvre directement la zone de description de création spéciale —
  // même mécanisme que le CTA équivalent sur la page Collection.
  const startSpecialProject = () => {
    goTo('commander');
    window.setTimeout(() => {
      window.dispatchEvent(new Event('open-special-request'));
    }, 50);
  };

  return (
    <div className="page active" id="page-accueil">

      {/* ================= HERO ================= */}
      <section
        className="hero2 nav-section"
        data-nav-theme="chocolate"
        data-nav-text="light"
        data-nav-section-id="accueil"
      >
        <div className="hero2-bg">
          {heroImages.map((src, i) => (
            <motion.img
              key={src}
              src={src}
              alt="Création Nice Création"
              initial={false}
              animate={{ opacity: i === heroIdx ? 1 : 0 }}
              transition={{ duration: 2.2, ease: 'easeInOut' }}
            />
          ))}
        </div>

        <motion.div
          className="hero2-content"
          initial="hidden"
          animate="visible"
          variants={heroContainer}
        >
          <motion.div className="hero2-typewriter-wrap" variants={heroItem}>
            <span className="hero2-typewriter">{typedWelcome}<span className="hero2-caret" /></span>
          </motion.div>

          <motion.h1 className="hero2-title" variants={heroItem}>
            L'art du crochet,<br /><em>réinventé.</em>
          </motion.h1>

          <motion.p className="hero2-desc" variants={heroItem}>
            Créations faites main au Bénin. Des pièces singulières,
            pensées pour durer.
          </motion.p>

          <motion.div className="hero2-cta-row" variants={heroItem}>
            <button className="btn btn-fill" onClick={() => goTo('collection')}>
              <span>Découvrir la collection</span>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        </motion.div>

        <div className="hero2-wave" aria-hidden="true">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0,40 Q720,90 1440,40 L1440,80 L0,80 Z" fill="#3A2117" />
          </svg>
        </div>
      </section>

      {/* ================= BANDE DE MOTIFS =================
          Placée juste après la vague (même teinte chocolat) pour une
          continuité visuelle, avant de passer au fond clair du manifeste. */}
      <div className="motif-strip">
        <div className="motif-track">
          {[...motifItems, ...motifItems, ...motifItems].map((m, i) => (
            <span className="motif-item" key={i}>
              {m.icon} <strong>{m.label}</strong>
              <span className="motif-dot" />
            </span>
          ))}
        </div>
      </div>

      {/* ================= MANIFESTE ================= */}
      <div className="manifesto-band">
        <p>« Chaque pièce est unique. <em>Comme vous.</em> »</p>
      </div>

      {/* ================= LES PIÈCES SIGNATURE ================= */}
      <section className="creations-section" data-nav-section-id="collection">
        <div className="creations-head">
          <div>
            <div className="section-label">Notre sélection</div>
            <h2 className="section-title section-title-lg display-strong">Les pièces <em>signature</em></h2>
            <p className="creations-lead">Découvrez les créations emblématiques de Nice Création.</p>
          </div>
          <button className="btn" onClick={() => goTo('collection')}>
            <span>Voir toute la collection</span>
          </button>
        </div>

        <motion.div
          className="creations-carousel"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
        >
          {creations.map((c) => (
            <motion.div className={`creation-card mat-${c.material}`} key={c.id} variants={reveal}>
              <div className="creation-media">
                <span className="creation-emoji">{c.emoji}</span>
                {/* Zone prévue pour une vraie photo produit :
                    <img src={c.photo} alt={c.name} /> */}
              </div>
              <span className="creation-material">{c.material === 'wax' ? 'Wax' : 'Crochet'}</span>
              <span className="creation-badge">{c.tag}</span>
              <span className="creation-hover-label">Voir la pièce →</span>
              <div className="creation-info">
                <h3>{c.name}</h3>
                <p>{c.subtitle}</p>
                <div className="creation-row">
                  <span className="creation-price">{c.price.toLocaleString('fr-FR')} FCFA</span>
                  <button className="creation-cta" onClick={() => handleAddToCart(c)}>Découvrir →</button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ================= COLLECTION 2026 ================= */}
      <section className="editions-section">
        <div className="section-label" style={{ justifyContent: 'center' }}>Collection 2026</div>
        <h2 className="section-title section-title-lg display-strong" style={{ textAlign: 'center' }}>Nos <em>éditions</em></h2>

        <motion.div
          className="editions-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {editions.map((ed) => (
            <motion.div className="edition-card" key={ed.name} variants={reveal}>
              <div className="edition-swatch" style={{ background: ed.palette }} />
              <div className="edition-body">
                <h3>{ed.name}</h3>
                <p>{ed.story}</p>
                <span className="edition-count">{ed.count} pièces</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ================= L'ART DU FAIT MAIN ================= */}
      <section className="craft-section">
        <div className="section-label" style={{ justifyContent: 'center' }}>L'art du fait main</div>
        <h2 className="section-title section-title-lg display-strong" style={{ textAlign: 'center' }}>Un savoir-faire <em>sans compromis</em></h2>

        <motion.div
          className="craft-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          {craftValues.map((v) => (
            <motion.div className="craft-item" key={v.title} variants={reveal}>
              <span className="craft-icon">{v.icon}</span>
              <h4>{v.title}</h4>
              <p>{v.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ================= SUR MESURE ================= */}
      <section className="suremesure nav-section" id="suremesure-section" data-nav-theme="chocolate" data-nav-text="light">
        <motion.div
          className="suremesure-inner"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.span className="section-label" style={{ color: 'var(--gold)', justifyContent: 'center' }} variants={reveal}>
            L'expérience sur mesure
          </motion.span>
          <motion.h2 className="display-strong" variants={reveal}>
            Créez <em>votre pièce</em>
          </motion.h2>
          <motion.p className="suremesure-lead" variants={reveal}>
            Imaginez-la. Nous la crochetons.
          </motion.p>

          <motion.ul className="suremesure-questions" variants={reveal}>
            <li>Une couleur particulière ?</li>
            <li>Une taille spécifique ?</li>
            <li>Une inspiration à transformer en création ?</li>
          </motion.ul>

          <motion.div variants={reveal}>
            <button className="btn btn-fill" onClick={startSpecialProject}>
              <span>Commencer mon projet</span>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* ================= PROCESSUS DE COMMANDE (compact) ================= */}
      <section className="process-section">
        <div className="section-label" style={{ justifyContent: 'center' }}>Comment commander</div>
        <h2 className="section-title section-title-lg display-strong">Le processus de <em>commande</em></h2>

        <motion.div
          className="process-row"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={staggerContainer}
        >
          {processSteps.map((s, i) => (
            <motion.div className="process-step" key={s.num} variants={reveal}>
              <div className="process-num">{s.num}</div>
              <h4>{s.title}</h4>
              <p>{s.sub}</p>
              {i < processSteps.length - 1 && <span className="process-arrow">→</span>}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ================= QUI NOUS SOMMES / L'ATELIER ================= */}
      <section className="maker nav-section" id="apropos-section" data-nav-theme="chocolate" data-nav-text="light">
        <div className="maker-inner">
          <motion.div
            className="maker-photo"
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={storyImage} alt="L'atelier Nice Création" />
          </motion.div>

          <motion.div
            className="maker-text"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.span className="tag" variants={reveal}>Qui nous sommes</motion.span>
            <motion.h2 className="display-strong" variants={reveal}>
              Née d'une <em>ambition</em>,<br />devenue un <em>savoir-faire</em>.
            </motion.h2>
            <motion.p variants={reveal}>
              Nice Création est une marque béninoise qui transforme le
              crochet en pièces contemporaines, élégantes et singulières.
            </motion.p>

            <motion.div variants={reveal}>
              <button className="btn-outline-light" onClick={() => goTo('histoire')}>
                <span>Notre histoire</span>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= FORMATIONS ================= */}
      <motion.section
        className="formation-cta nav-section"
        data-nav-theme="terracotta"
        data-nav-text="light"
        data-nav-section-id="formations"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="formation-cta-bg" aria-hidden="true">FORMATION</div>
        <div className="formation-cta-inner">
          <span className="section-label formation-label">Formations</span>
          <h2 className="display-strong">Transmettre le <em>savoir-faire</em></h2>
          <p>
            Apprenez le crochet à votre rythme, de l'initiation au
            niveau avancé.
          </p>

          <div className="formation-tags">
            <span className="formation-tag-pill">Formations à Cotonou</span>
            <span className="formation-tag-pill">Formations en ligne</span>
          </div>

          <button className="btn btn-fill" onClick={() => goTo('formations')}>
            <span>Découvrir les formations</span>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </motion.section>

      {/* ================= TÉMOIGNAGES ================= */}
      <div className="section nav-section" data-nav-theme="cream" data-nav-text="dark">
        <div className="section-label" style={{ padding: '0 clamp(1.5rem,6vw,5rem)' }}>Elles et ils en parlent</div>
        <h2 className="section-title section-title-lg display-strong" style={{ padding: '0 clamp(1.5rem,6vw,5rem)' }}>Ce qu'on <em>en dit</em></h2>

        <motion.div
          className="testimonials-track"
          ref={trackRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
        >
          <div className="testimonials-inner">
            {testimonialsData.map((t, i) => (
              <motion.div className="testimonial-card" key={i} variants={reveal}>
                <div className="testimonial-avatar">{t.initial}</div>
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-text">« {t.text} »</p>
                <div className="testimonial-author">{t.author}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="testimonials-nav">
          <button className="t-btn" onClick={() => slideTestimonials(-1)}>←</button>
          <button className="t-btn" onClick={() => slideTestimonials(1)}>→</button>
        </div>
      </div>

      {/* ================= SUIVEZ NOTRE UNIVERS (Instagram) =================
          Vignettes statiques pour l'instant : un vrai flux Instagram
          nécessiterait l'API Meta (Instagram Graph API) et un accès
          développeur côté backend, non configuré ici. */}
      <section className="insta-section">
        <div className="section-label" style={{ justifyContent: 'center' }}>Suivez notre univers</div>
        <h2 className="section-title section-title-lg display-strong" style={{ textAlign: 'center' }}>Sur <em>Instagram</em></h2>

        <div className="insta-grid">
          {['🧶', '👜', '🌿', '✨', '🎀', '🧺'].map((emoji, i) => (
            <a
              key={i}
              className="insta-tile"
              href="https://www.instagram.com/nice.creation1?igsh=Z3AxdHhsaHE4Mjdv"
              target="_blank"
              rel="noreferrer"
            >
              <span>{emoji}</span>
            </a>
          ))}
        </div>

        <div className="insta-cta">
          <a href="https://www.instagram.com/nice.creation1?igsh=Z3AxdHhsaHE4Mjdv" target="_blank" rel="noreferrer">
            @nice.creation1 →
          </a>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <div className="nav-section" data-nav-theme="cream" data-nav-text="dark">
        <FooterFull goTo={goTo} />
      </div>

    </div>
  );
}