import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FooterFull } from '../components/Footer';
import heroImage from "../ressources/photo14.jpg";
import storyImage from "../ressources/photo7.jpg";

const tickerItems = [
  'Fait main avec amour',
  'Séries limitées',
  'Marque béninoise',
  '100% artisanal',
  'Sur mesure',
  'Livraison sécurisée',
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

const revealLeft = {
  hidden: { opacity: 0, x: -36 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function Home({ goTo, addToCart }) {
  const [tIdx, setTIdx] = useState(0);
  const trackRef = useRef(null);

  const heroRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleAddToCart = (product) => {
    if (!addToCart) {
      console.error("La fonction addToCart n'est pas disponible.");
      return;
    }

    addToCart({
      ...product,
      quantity: 1,
    });

    goTo('commander');
  };

  const slide = (dir) => {
    if (!trackRef.current) return;

    const cards = trackRef.current.querySelectorAll('.testimonial-card');
    if (!cards.length) return;

    const visible = window.innerWidth <= 640 ? 1 : 2;
    const max = Math.max(0, cards.length - visible);
    const next = Math.max(0, Math.min(max, tIdx + dir));

    setTIdx(next);
    trackRef.current.style.transform =
      `translateX(-${next * (cards[0].offsetWidth + 24)}px)`;
  };

  const handleHeroMouseMove = (e) => {
    if (!heroRef.current || window.innerWidth <= 900) return;

    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    setTilt({ x, y });
  };

  const handleHeroMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div className="page active" id="page-accueil">

      {/* ================= HERO ÉDITORIAL ================= */}
      <section
        className="hero2 nav-section"
        data-nav-theme="cream"
        data-nav-text="dark"
        data-nav-section-id="accueil"
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
      >
        <div className="hero2-bgtext" aria-hidden="true">CROCHET</div>

        <div className="hero2-grid">

          {/* Le nom de la marque arrive volontairement avant la légende. */}
          <motion.div
            className="hero2-copy"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
          >
            <motion.h1 className="hero2-title" variants={reveal}>
              Nice
              <br />
              <em>Création</em>
            </motion.h1>

            <motion.div className="hero2-eyebrow" variants={reveal}>
              Atelier créatif · Cotonou, Bénin
            </motion.div>

            <motion.p className="hero2-desc" variants={reveal}>
              Des pièces en crochet <strong>100% faites main</strong>,
              pensées comme des œuvres uniques — séries limitées,
              matières choisies, finitions impeccables.
            </motion.p>

            <motion.div className="hero2-cta-row" variants={reveal}>
              <button
                className="btn btn-fill"
                onClick={() => goTo('collection')}
              >
                <span>Découvrir nos créations</span>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>

              <button
                className="btn"
                onClick={() => goTo('apropos')}
              >
                <span>Notre histoire</span>
              </button>
            </motion.div>

            <motion.div className="hero2-steps" variants={reveal}>
              <span><b>01</b> Choisissez</span>
              <span><b>02</b> Sur mesure</span>
              <span><b>03</b> Livraison</span>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero2-visual"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="hero2-photo-float">
              <motion.div
                className="hero2-photo-card"
                animate={{
                  x: tilt.x * 7,
                  y: tilt.y * 7,
                  rotate: -3 + tilt.x * 1.2,
                }}
                transition={{ type: 'spring', stiffness: 90, damping: 18, mass: 0.5 }}
              >
                <img src={heroImage} alt="Création Nice Création" />
              </motion.div>
            </div>

            <motion.div
              className="hero2-chip-float hero2-chip-pos-a"
              animate={{ x: tilt.x * 10, y: tilt.y * 8, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 70, damping: 16 }}
            >
              <div className="hero2-chip">
                <span className="hero2-chip-num">100%</span>
                <span className="hero2-chip-label">Fait main<br />au Bénin</span>
              </div>
            </motion.div>

            <motion.div
              className="hero2-chip-float hero2-chip-pos-b"
              animate={{ x: tilt.x * -8, y: tilt.y * -6, rotate: -6 }}
              transition={{ type: 'spring', stiffness: 70, damping: 16 }}
            >
              <div className="hero2-chip hero2-chip-stars">
                <span>★★★★★</span>
                <span className="hero2-chip-label">Clientes conquises</span>
              </div>
            </motion.div>

            <motion.div
              className="hero2-chip-float hero2-chip-pos-c"
              animate={{ x: tilt.x * 6, y: tilt.y * 5, rotate: 4 }}
              transition={{ type: 'spring', stiffness: 70, damping: 16 }}
            >
              <div className="hero2-chip hero2-chip-tag">
                🧶 Séries limitées
              </div>
            </motion.div>
          </motion.div>

        </div>

        <div className="hero-scroll">Scroll</div>
      </section>

      {/* ================= MARQUEE ================= */}
      <div className="marquee2-wrap nav-section" data-nav-theme="chocolate" data-nav-text="light" data-nav-section-id="apropos">
        <div className="marquee2">
          <div className="marquee2-track">
            {[...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i}>
                {item}
                <span className="dot"></span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ================= NOTRE HISTOIRE ================= */}
      <section className="story nav-section" id="apropos-section" data-nav-theme="chocolate" data-nav-text="light">
        <div className="story-grid">

          <motion.div
            className="story-bigtext"
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
          >
            <span className="story-label">Notre histoire</span>
            <h2>
              Née d'une <em>ambition</em>,
              <br />
              devenue un <em>savoir-faire</em>.
            </h2>
          </motion.div>

          <motion.div
            className="story-text"
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <p>
              <strong>Nice Création</strong> est née d'une ambition simple :
              devenir indépendante en maîtrisant un vrai métier de savoir-faire.
              Le crochet s'est imposé comme une évidence.
            </p>
            <p>
              Chaque pièce porte une histoire — des heures de patience,
              des nuits de travail, mais surtout de la précision et
              du raffinement dans chaque maille.
            </p>
            <p>
              Aujourd'hui, la marque grandit : une communauté fidèle,
              des créations sur-mesure et des formations pour transmettre
              ce savoir-faire béninois. 🧶
            </p>
          </motion.div>

          <motion.div
            className="story-photo"
            variants={revealLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <img src={storyImage} alt="Création artisanale Nice Création" />
            <div className="story-photo-tag">Artisanat & passion</div>
          </motion.div>

          <motion.div
            className="story-stats"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.12 }
              }
            }}
          >
            <motion.div className="story-stat" variants={reveal}>
              <strong>100%</strong>
              <span>Fait main</span>
            </motion.div>
            <motion.div className="story-stat" variants={reveal}>
              <strong>3</strong>
              <span>Étapes, zéro stress</span>
            </motion.div>
            <motion.div className="story-stat" variants={reveal}>
              <strong>∞</strong>
              <span>Séries limitées</span>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* ================= CRÉATIONS ================= */}
      <section className="section bento-section nav-section" data-nav-theme="cream" data-nav-text="dark" data-nav-section-id="collection">
        <div className="section-label">Notre sélection</div>
        <h2 className="section-title">Créations <em>en vogue</em></h2>
        <div className="section-divider"></div>

        <div className="bento-grid">

          <motion.div className="bento-card bento-lg" whileHover={{ y: -8 }} transition={{ duration: 0.35 }}>
            <div className="bento-media">
              <div className="bento-placeholder">🌿</div>
              <div className="bento-badge">Nouveauté</div>
            </div>
            <div className="bento-info">
              <h3>Robe Crochet Ivoire</h3>
              <p>Élégance naturelle et légèreté pour toutes occasions</p>
              <div className="bento-row">
                <span className="bento-price">15 000 FCFA</span>
                <button
                  className="bento-btn"
                  onClick={() => handleAddToCart({
                    id: 'robe-crochet-ivoire',
                    name: 'Robe Crochet Ivoire',
                    price: 15000,
                  })}
                >
                  Commander →
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div className="bento-card bento-sm" whileHover={{ y: -8 }} transition={{ duration: 0.35 }}>
            <div className="bento-media bento-media-accent">
              <div className="bento-badge bento-badge-dark">Best-seller</div>
            </div>
            <div className="bento-info">
              <h3>Top Crochet Élégant</h3>
              <p>Plusieurs teintes, parfait pour l'été</p>
              <div className="bento-row">
                <span className="bento-price">8 000 FCFA</span>
                <button
                  className="bento-btn"
                  onClick={() => handleAddToCart({
                    id: 'top-crochet-elegant',
                    name: 'Top Crochet Élégant',
                    price: 8000,
                  })}
                >
                  Commander →
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div className="bento-card bento-md" whileHover={{ y: -8 }} transition={{ duration: 0.35 }}>
            <div className="bento-media bento-media-dark">
              <div className="bento-placeholder">🎀</div>
              <div className="bento-badge bento-badge-dark">Édition limitée</div>
            </div>
            <div className="bento-info">
              <h3>Ensemble Deux Pièces</h3>
              <p>Tenue élégante et confortable pour toute occasion</p>
              <div className="bento-row">
                <span className="bento-price">20 000 FCFA</span>
                <button
                  className="bento-btn"
                  onClick={() => handleAddToCart({
                    id: 'ensemble-deux-pieces',
                    name: 'Ensemble Deux Pièces',
                    price: 20000,
                  })}
                >
                  Commander →
                </button>
              </div>
            </div>
          </motion.div>

        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button className="btn" onClick={() => goTo('collection')}>
            <span>Voir toute la collection</span>
          </button>
        </div>
      </section>

      {/* ================= CTA FORMATIONS ================= */}
      <section className="formation-cta nav-section" data-nav-theme="terracotta" data-nav-text="light" data-nav-section-id="formations">
        <div className="formation-cta-bg" aria-hidden="true">FORMATION</div>

        <div className="formation-cta-inner">
          <span className="section-label formation-label">
            Apprenez le crochet
          </span>

          <h2>Envie de vous <em>former</em> ?</h2>

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
      </section>

      {/* ================= TÉMOIGNAGES ================= */}
      <div className="section nav-section" data-nav-theme="cream" data-nav-text="dark">
        <div className="section-label">Elles nous font confiance</div>
        <h2 className="section-title">Ce qu'elles <em>disent</em></h2>
        <div className="section-divider"></div>

        <div className="testimonials-track">
          <div className="testimonials-inner" id="testimonials" ref={trackRef}>
            {testimonialsData.map((t, i) => (
              <div className="testimonial-card" key={i}>
                <div className="testimonial-quote">"</div>
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">{t.author}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="testimonials-nav">
          <button className="t-btn" onClick={() => slide(-1)}>←</button>
          <button className="t-btn" onClick={() => slide(1)}>→</button>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="nav-section" data-nav-theme="chocolate" data-nav-text="light">
        <FooterFull goTo={goTo} />
      </div>

    </div>
  );
}
