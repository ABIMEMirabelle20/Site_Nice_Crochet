import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FooterFull } from '../components/Footer';
import heroImage from "../ressources/photo14.jpg";
import storyImage from "../ressources/photo7.jpg";

// L'image du hero change automatiquement, en fondu-enchaîné continu.
// Ajoute d'autres imports ici et pousse-les dans ce tableau pour
// enrichir la rotation.
const heroImages = [heroImage, storyImage];

// Bande de motifs qui défile en continu sous le hero.
const motifItems = [
  { icon: '🧶', label: '100% fait main' },
  { icon: '★', label: 'Note 5/5' },
  { icon: '✂️', label: '+200 clientes satisfaites' },
  { icon: '🪡', label: 'Séries limitées' },
];

const processSteps = [
  { num: '01', title: 'Choisissez', desc: 'Parcourez la collection ou décrivez votre pièce sur-mesure.' },
  { num: '02', title: 'Sur mesure', desc: 'Vos mensurations et préférences guident la confection.' },
  { num: '03', title: 'Livraison', desc: 'Réception soignée, où que vous soyez au Bénin.' },
];

const creations = [
  {
    id: 'robe-crochet-ivoire',
    name: 'Robe Crochet Ivoire',
    desc: 'Élégance naturelle et légèreté pour toutes occasions',
    price: 15000,
    tag: 'Nouveauté',
    emoji: '🌿',
    material: 'crochet',
  },
  {
    id: 'top-crochet-elegant',
    name: 'Top Crochet Élégant',
    desc: "Plusieurs teintes, parfait pour l'été",
    price: 8000,
    tag: 'Best-seller',
    emoji: '🎀',
    material: 'crochet',
  },
  {
    id: 'ensemble-deux-pieces',
    name: 'Ensemble Deux Pièces',
    desc: 'Tenue élégante et confortable pour toute occasion',
    price: 20000,
    tag: 'Édition limitée',
    emoji: '✨',
    material: 'crochet',
  },
  {
    id: 'sac-wax-tresse',
    name: 'Sac Wax Tressé',
    desc: 'Tissu wax authentique, doublure intérieure cousue main',
    price: 12000,
    tag: 'Accessoire',
    emoji: '🧺',
    material: 'wax',
  },
];

const testimonialsData = [
  {
    text: "Les créations de Nice Crochet sont incroyables ! Raffinées, élégantes, et faites avec amour.",
    author: '— Aïcha B.'
  },
  {
    text: "Commande reçue très rapidement. Service top et qualité parfaitement au rendez-vous. Je recommande !",
    author: '— Mariam T.'
  },
  {
    text: "Ma marque préférée pour les pièces faites main. Le soin apporté à chaque création est exceptionnel.",
    author: '— Vanessa L.'
  },
  {
    text: "Ma robe sur mesure est exactement ce que j'avais imaginé, en encore mieux. Une vraie pépite béninoise.",
    author: '— Fatou D.'
  },
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

  return (
    <div className="page active" id="page-accueil">

      {/* ================= HERO PLEIN ÉCRAN ================= */}
      <section
        className="hero2 nav-section"
        data-nav-theme="chocolate"
        data-nav-text="light"
        data-nav-section-id="accueil"
      >
        {/* Toutes les images restent montées en permanence, empilées ;
            seule l'opacité change, en fondu lent — jamais de démontage,
            donc jamais de flash sur le fond marron entre deux photos. */}
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
          <motion.span className="hero2-welcome" variants={heroItem}>Bienvenue chez</motion.span>
          <motion.h1 className="hero2-title" variants={heroItem}>
            <em>Nice Création</em>
          </motion.h1>

          <motion.p className="hero2-desc" variants={heroItem}>
            Des pièces en crochet <strong>100% faites main</strong>,
            pensées comme des œuvres uniques — séries limitées,
            matières choisies, finitions impeccables.
          </motion.p>

          <motion.div className="hero2-cta-row" variants={heroItem}>
            <button className="btn btn-fill" onClick={() => goTo('collection')}>
              <span>Découvrir nos créations</span>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <button className="btn-outline-light" onClick={() => goTo('apropos')}>
              <span>Notre histoire</span>
            </button>
          </motion.div>

          <motion.span className="hero2-eyebrow" variants={heroItem}>
            Atelier créatif · Cotonou, Bénin
          </motion.span>
        </motion.div>

        {/* Bord en vague, enchaîne avec la bande de motifs */}
        <div className="hero2-wave" aria-hidden="true">
          <svg viewBox="0 0 1440 90" preserveAspectRatio="none">
            <path d="M0,32 C240,90 480,0 720,24 C960,48 1200,90 1440,40 L1440,90 L0,90 Z" fill="#3D2417" />
          </svg>
        </div>
      </section>

      {/* ================= BANDE DE MOTIFS — défilement continu ================= */}
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

      {/* ================= 1. QU'EST-CE QUE LA MARQUE / POURQUOI ================= */}
      <section className="maker nav-section" id="apropos-section" data-nav-theme="chocolate" data-nav-text="light" data-nav-section-id="apropos">
        <div className="maker-inner">
          <motion.div
            className="maker-photo"
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={storyImage} alt="La créatrice de Nice Création" />
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
              Née d'une <em>ambition</em>, devenue un <em>savoir-faire</em>
            </motion.h2>
            <motion.p variants={reveal}>
              <strong>Nice Création</strong> est née d'une ambition simple : devenir
              indépendante en maîtrisant un vrai métier de savoir-faire. Le crochet
              s'est imposé comme une évidence.
            </motion.p>
            <motion.p variants={reveal}>
              Chaque pièce porte une histoire — des heures de patience, des nuits
              de travail, mais surtout de la précision et du raffinement dans
              chaque maille. Aujourd'hui, la marque grandit : une communauté
              fidèle, des créations sur-mesure et des formations pour transmettre
              ce savoir-faire béninois. 🧶
            </motion.p>

            <motion.div className="maker-benefits" variants={reveal}>
              <div className="maker-benefit">
                <span className="maker-benefit-icon">🪡</span>
                <span>Fait main, pièce par pièce</span>
              </div>
              <div className="maker-benefit">
                <span className="maker-benefit-icon">♻️</span>
                <span>Matières choisies, durables</span>
              </div>
              <div className="maker-benefit">
                <span className="maker-benefit-icon">🎁</span>
                <span>Séries limitées, uniques</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= 2. CE QUE NOUS PROPOSONS ================= */}
      <section className="creations-section" data-nav-section-id="collection">
        <div className="creations-head">
          <div>
            <div className="section-label">Notre sélection</div>
            <h2 className="section-title section-title-lg display-strong">Créations <em>en vogue</em></h2>
          </div>
          <button className="btn" onClick={() => goTo('collection')}>
            <span>Toute la collection</span>
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
              </div>
              <span className="creation-material">{c.material === 'wax' ? 'Wax' : 'Crochet'}</span>
              <span className="creation-badge">{c.tag}</span>
              <div className="creation-info">
                <h3>{c.name}</h3>
                <p>{c.desc}</p>
                <div className="creation-row">
                  <span className="creation-price">{c.price.toLocaleString('fr-FR')} FCFA</span>
                  <button className="creation-cta" onClick={() => handleAddToCart(c)}>Commander</button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ================= 3. COMMENT COMMANDER ================= */}
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
              {i < processSteps.length - 1 && <span className="process-line" />}
              <div className="process-num">{s.num}</div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ================= 4. POSSIBILITÉS DE FORMATION ================= */}
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
          <span className="section-label formation-label">Apprenez le crochet</span>
          <h2 className="display-strong">Envie de vous <em>former</em> ?</h2>
          <p>
            Du débutant au niveau avancé, progressez à votre rythme
            à Cotonou ou en ligne, avec un accompagnement personnalisé.
          </p>
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
        <div className="section-label" style={{ padding: '0 clamp(1.5rem,6vw,5rem)' }}>Elles nous font confiance</div>
        <h2 className="section-title section-title-lg display-strong" style={{ padding: '0 clamp(1.5rem,6vw,5rem)' }}>Ce qu'elles <em>disent</em></h2>

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
                <div className="testimonial-quote">"</div>
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-text">{t.text}</p>
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

      {/* ================= FOOTER ================= */}
      <div className="nav-section" data-nav-theme="cream" data-nav-text="dark">
        <FooterFull goTo={goTo} />
      </div>

    </div>
  );
}