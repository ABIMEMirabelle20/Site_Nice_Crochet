import { useEffect, useRef, useState } from 'react';
import { FooterFull } from '../components/Footer';
import heroImage from "../ressources/photo9.jpg";

const tickerItems = [
  'Fait main avec amour', 'Séries limitées', 'Marque béninoise',
  '100% artisanal', 'Sur mesure', 'Livraison sécurisée',
];

const testimonialsData = [
  { text:"Les créations de Nice Crochet sont incroyables ! Raffinées, élégantes, et faites avec amour.", author:'— Aïcha B.' },
  { text:"Commande reçue très rapidement. Service top et qualité parfaitement au rendez-vous. Je recommande !", author:'— Mariam T.' },
  { text:"Ma marque préférée pour les pièces faites main. Le soin apporté à chaque création est exceptionnel.", author:'— Vanessa L.' },
  { text:"Ma robe sur mesure est exactement ce que j'avais imaginé, en encore mieux. Une vraie pépite béninoise.", author:'— Fatou D.' },
];

export default function Home({ goTo }) {
  const [tIdx, setTIdx] = useState(0);
  const trackRef = useRef(null);

  const slide = (dir) => {
    const cards = trackRef.current.querySelectorAll('.testimonial-card');
    const visible = window.innerWidth <= 640 ? 1 : 2;
    const max = cards.length - visible;
    const next = Math.max(0, Math.min(max, tIdx + dir));
    setTIdx(next);
    trackRef.current.style.transform = `translateX(-${next * (cards[0].offsetWidth + 24)}px)`;
  };

  return (
    <div className="page active" id="page-accueil">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-eyebrow">Artisanat béninois · Édition limitée</div>
          <h1>Bienvenue chez<br /><em>Nice Crochet</em></h1>
          <p className="hero-desc">
            Un univers de passion, d'élégance et de savoir-faire. Nos pièces sont <strong>100% faites main</strong>,
            en séries limitées, avec des matières soigneusement sélectionnées.
          </p>
          <button className="btn btn-fill" onClick={() => goTo('collection')}>
            <span>Découvrir nos créations</span>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
        </div>
        <div className="hero-visual">
          <div className="hero-visual-bg"></div>
          <div className="hero-visual-pattern"></div>
          <div className="hero-visual">
  <img
    src={heroImage}
    alt="Nice Crochet"
    className="hero-image"
  />
</div>
        </div>
        <div className="hero-scroll">Scroll</div>
      </section>

      <div className="ticker-wrap">
        <div className="ticker">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span className="ticker-item" key={i}>{item} <span className="dot"></span></span>
          ))}
        </div>
      </div>

      <div className="why-strip">
        <div className="why-grid">
          <div className="why-card reveal"><div className="why-num">01</div><h3>Fait main avec amour</h3><p>Chaque pièce est conçue avec patience et précision pour une finition impeccable qui vous distingue.</p></div>
          <div className="why-card reveal"><div className="why-num">02</div><h3>Durable & responsable</h3><p>Matières sélectionnées et production raisonnée pour des vêtements qui durent dans le temps.</p></div>
          <div className="why-card reveal"><div className="why-num">03</div><h3>Commande simple</h3><p>Choix, prise de mesures, acompte et livraison sécurisée. Vous êtes suivi à chaque étape.</p></div>
        </div>
      </div>

      <div className="section">
        <div className="section-label">Notre sélection</div>
        <h2 className="section-title">Créations <em>en vogue</em></h2>
        <div className="section-divider"></div>
        <div className="products-grid">
          <div className="product-card reveal">
            <div className="product-img-wrap"><div className="product-placeholder">🌿</div><div className="product-badge" style={{ background: 'var(--terracotta)' }}>Nouveauté</div></div>
            <div className="product-info"><h3>Robe Crochet Ivoire</h3><p>Élégance naturelle et légèreté pour toutes occasions</p><div className="product-price">15 000 FCFA</div></div>
            <button className="product-card-btn" onClick={() => goTo('commander')}>Commander →</button>
          </div>
          <div className="product-card reveal">
            <div className="product-img-wrap"><div className="product-placeholder" style={{ background: 'linear-gradient(135deg,var(--terracotta),var(--chocolate-light))' }}></div><div className="product-badge" style={{ background: 'var(--chocolate-light)' }}>Best-seller</div></div>
            <div className="product-info"><h3>Top Crochet Élégant</h3><p>Disponible en plusieurs teintes, parfait pour l'été</p><div className="product-price">8 000 FCFA</div></div>
            <button className="product-card-btn" onClick={() => goTo('commander')}>Commander →</button>
          </div>
          <div className="product-card reveal">
            <div className="product-img-wrap"><div className="product-placeholder" style={{ background: 'linear-gradient(135deg,var(--chocolate-light),var(--chocolate))' }}>🎀</div><div className="product-badge" style={{ background: 'var(--chocolate)' }}>Édition limitée</div></div>
            <div className="product-info"><h3>Ensemble Deux Pièces</h3><p>Tenue élégante et confortable pour toute occasion</p><div className="product-price">20 000 FCFA</div></div>
            <button className="product-card-btn" onClick={() => goTo('commander')}>Commander →</button>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <button className="btn" onClick={() => goTo('collection')}><span>Voir toute la collection</span></button>
        </div>
      </div>

      <div className="process-bg">
        <div className="process-inner">
          <div className="process-title-area reveal">
            <div className="section-label">Comment ça marche</div>
            <h2 className="section-title">Processus de <em>commande</em></h2>
            <div className="section-divider" style={{ background: 'var(--chocolate-light)' }}></div>
          </div>
          <div className="steps-grid">
            <div className="step reveal"><div className="step-icon">🎯</div><div className="step-num">01</div><h3>Choisissez</h3><p>Un modèle existant ou une pièce entièrement sur-mesure selon vos envies.</p></div>
            <div className="step reveal"><div className="step-icon">📏</div><div className="step-num">02</div><h3>Mesures</h3><p>Nous récupérons vos mensurations en ligne ou en présentiel pour un ajustement parfait.</p></div>
            <div className="step reveal"><div className="step-icon">🧶</div><div className="step-num">03</div><h3>Fabrication</h3><p>Confection artisanale avec soin, précision et raffinement. Chaque point compte.</p></div>
            <div className="step reveal"><div className="step-icon">📦</div><div className="step-num">04</div><h3>Livraison</h3><p>Remise en main propre ou livraison sécurisée avec suivi complet.</p></div>
          </div>
          <div style={{ marginTop: '2.5rem' }}>
            <button className="btn" style={{ borderColor: 'var(--terracotta)', color: 'var(--terracotta)' }} onClick={() => goTo('commander')}>
              <span>Commander maintenant</span>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>

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

      <FooterFull goTo={goTo} />
    </div>
  );
}
