import { useRef, useState } from 'react';
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

export default function Home({ goTo, addToCart }) {
  const [tIdx, setTIdx] = useState(0);
  const trackRef = useRef(null);

  const heroRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Ajouter un produit au panier puis aller à la page Commander
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

    const next = Math.max(
      0,
      Math.min(max, tIdx + dir)
    );

    setTIdx(next);

    trackRef.current.style.transform =
      `translateX(-${next * (cards[0].offsetWidth + 24)}px)`;
  };

  // Micro-parallax du hero au mouvement de la souris (desktop uniquement,
  // neutre sur mobile/tactile puisqu'aucun mousemove n'y est déclenché)
  const handleHeroMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setTilt({ x, y });
  };

  const handleHeroMouseLeave = () => setTilt({ x: 0, y: 0 });

  const parallax = (factor, rotate = 0) => ({
    transform: `rotate(${rotate}deg) translate(${(tilt.x * factor * 8).toFixed(1)}px, ${(tilt.y * factor * 8).toFixed(1)}px)`
  });

  return (
    <div className="page active" id="page-accueil">

      {/* ================= HERO ÉDITORIAL ================= */}

      <section
        className="hero2"
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
      >

        <div className="hero2-bgtext" aria-hidden="true">CROCHET</div>

        <div className="hero2-grid">

          <div className="hero2-copy">

            <div className="hero2-eyebrow">
              Atelier créatif · Cotonou, Bénin
            </div>

            <h1 className="hero2-title">
              Nice
              <br />
              <em>Création</em>
            </h1>

            <p className="hero2-desc">
              Des pièces en crochet <strong>100% faites main</strong>,
              pensées comme des œuvres uniques — séries limitées,
              matières choisies, finitions impeccables.
            </p>

            <div className="hero2-cta-row">
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
            </div>

            <div className="hero2-steps">
              <span><b>01</b> Choisissez</span>
              <span><b>02</b> Sur mesure</span>
              <span><b>03</b> Livraison</span>
            </div>

          </div>

          <div className="hero2-visual">

            <div className="hero2-photo-float">
              <div
                className="hero2-photo-card"
                style={parallax(0.6, -3)}
              >
                <img src={heroImage} alt="Nice Crochet" />
              </div>
            </div>

            <div className="hero2-chip-float hero2-chip-pos-a">
              <div className="hero2-chip" style={parallax(1.1, 5)}>
                <span className="hero2-chip-num">100%</span>
                <span className="hero2-chip-label">Fait main<br />au Bénin</span>
              </div>
            </div>

            <div className="hero2-chip-float hero2-chip-pos-b">
              <div className="hero2-chip hero2-chip-stars" style={parallax(-0.9, -6)}>
                <span>★★★★★</span>
                <span className="hero2-chip-label">Clientes conquises</span>
              </div>
            </div>

            <div className="hero2-chip-float hero2-chip-pos-c">
              <div className="hero2-chip hero2-chip-tag" style={parallax(0.8, 4)}>
                🧶 Séries limitées
              </div>
            </div>

          </div>

        </div>

        <div className="hero-scroll">Scroll</div>

      </section>

      {/* ================= MARQUEE ================= */}

      <div className="marquee2-wrap">
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

      {/* ================= NOTRE HISTOIRE (storytelling) ================= */}

      <section className="story" id="apropos-section">

        <div className="story-grid">

          <div className="story-bigtext reveal">
            <span className="story-label">Notre histoire</span>
            <h2>
              Née d'une <em>ambition</em>,
              <br />
              devenue un <em>savoir-faire</em>.
            </h2>
          </div>

          <div className="story-photo reveal-left">
            <img src={storyImage} alt="Création artisanale Nice Création" />
            <div className="story-photo-tag">Artisanat & passion</div>
          </div>

          <div className="story-text reveal-right">
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
          </div>

          <div className="story-stats reveal">
            <div className="story-stat">
              <strong>100%</strong>
              <span>Fait main</span>
            </div>
            <div className="story-stat">
              <strong>3</strong>
              <span>Étapes, zéro stress</span>
            </div>
            <div className="story-stat">
              <strong>∞</strong>
              <span>Séries limitées</span>
            </div>
          </div>

        </div>

      </section>

      {/* ================= CRÉATIONS (bento asymétrique) ================= */}

      <section className="section bento-section">

        <div className="section-label">Notre sélection</div>
        <h2 className="section-title">Créations <em>en vogue</em></h2>
        <div className="section-divider"></div>

        <div className="bento-grid">

          <div className="bento-card bento-lg reveal">
            <div className="bento-media">
              <div className="bento-placeholder">🌿</div>
              <div className="bento-badge" style={{ background: 'var(--terracotta)' }}>Nouveauté</div>
            </div>
            <div className="bento-info">
              <h3>Robe Crochet Ivoire</h3>
              <p>Élégance naturelle et légèreté pour toutes occasions</p>
              <div className="bento-row">
                <span className="bento-price">15 000 FCFA</span>
                <button
                  className="bento-btn"
                  onClick={() =>
                    handleAddToCart({
                      id: 'robe-crochet-ivoire',
                      name: 'Robe Crochet Ivoire',
                      price: 15000,
                    })
                  }
                >
                  Commander →
                </button>
              </div>
            </div>
          </div>

          <div className="bento-card bento-sm reveal">
            <div
              className="bento-media"
              style={{ background: 'linear-gradient(135deg,var(--terracotta),var(--chocolate-light))' }}
            >
              <div className="bento-badge" style={{ background: 'var(--chocolate-light)' }}>Best-seller</div>
            </div>
            <div className="bento-info">
              <h3>Top Crochet Élégant</h3>
              <p>Plusieurs teintes, parfait pour l'été</p>
              <div className="bento-row">
                <span className="bento-price">8 000 FCFA</span>
                <button
                  className="bento-btn"
                  onClick={() =>
                    handleAddToCart({
                      id: 'top-crochet-elegant',
                      name: 'Top Crochet Élégant',
                      price: 8000,
                    })
                  }
                >
                  Commander →
                </button>
              </div>
            </div>
          </div>

          <div className="bento-card bento-md reveal">
            <div
              className="bento-media"
              style={{ background: 'linear-gradient(135deg,var(--chocolate-light),var(--chocolate))' }}
            >
              <div className="bento-placeholder">🎀</div>
              <div className="bento-badge" style={{ background: 'var(--chocolate)' }}>Édition limitée</div>
            </div>
            <div className="bento-info">
              <h3>Ensemble Deux Pièces</h3>
              <p>Tenue élégante et confortable pour toute occasion</p>
              <div className="bento-row">
                <span className="bento-price">20 000 FCFA</span>
                <button
                  className="bento-btn"
                  onClick={() =>
                    handleAddToCart({
                      id: 'ensemble-deux-pieces',
                      name: 'Ensemble Deux Pièces',
                      price: 20000,
                    })
                  }
                >
                  Commander →
                </button>
              </div>
            </div>
          </div>

        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button className="btn" onClick={() => goTo('collection')}>
            <span>Voir toute la collection</span>
          </button>
        </div>

      </section>

      {/* ================= CTA FORMATIONS ================= */}

      <section className="formation-cta">

        <div className="formation-cta-bg" aria-hidden="true">FORMATION</div>

        <div className="formation-cta-inner">
          <span className="section-label" style={{ justifyContent: 'center', color: 'var(--chocolate)' }}>
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

      {/* ================= TEMOIGNAGES ================= */}

      <div className="section">

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

      <FooterFull goTo={goTo} />

    </div>
  );
}