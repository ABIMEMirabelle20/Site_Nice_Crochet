import { useState } from 'react';
import BackButton from '../components/BackButton';
import { FooterSimple } from '../components/Footer';
import { collectionItems } from '../data';

const FILTERS = [
  { key: 'all', label: 'Tout' },
  { key: 'robes', label: 'Robes' },
  { key: 'tops', label: 'Tops' },
  { key: 'ensembles', label: 'Ensembles' },
];

export default function Collection({
  goTo,
  showToast,
  addToCart,
  cartCount = 0,
}) {
  const [cat, setCat] = useState('all');
  const [fading, setFading] = useState(false);

  const items =
    cat === 'all'
      ? collectionItems
      : collectionItems.filter((i) => i.cat === cat);

  const filterCollection = (key) => {
    setFading(true);

    setTimeout(() => {
      setCat(key);
      setFading(false);
    }, 200);
  };

  const handleAddToCart = (item) => {
    addToCart({
      id: `${item.name}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 7)}`,
      name: item.name,
      emoji: item.emoji,
      price: item.price,
      taille: '',
      couleur: '',
      couleurAutre: '',
      notes: '',
    });

    showToast(`${item.name} ajouté au panier`);
  };

  return (
    <div className="page active" id="page-collection">

      {/* HERO */}
      <div className="collection-hero">
        <div>
          <div className="section-label">
            Artisanat & élégance
          </div>

          <h1>
            Notre <em>Collection</em>
          </h1>
        </div>

        <div className="collection-filters">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`filter-btn ${
                cat === f.key ? 'active' : ''
              }`}
              onClick={() => filterCollection(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* RETOUR */}
      <BackButton
        label="Retour à l'accueil"
        onClick={() => goTo('accueil')}
      />

      {/* PANIER */}
      <div
        className="back-wrap"
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          paddingTop: '.5rem',
        }}
      >
        <button
          className="btn"
          onClick={() => goTo('commander')}
        >
          <span>
            Voir mon panier
            {cartCount > 0 ? ` (${cartCount})` : ''}
          </span>

          <svg
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* COLLECTION */}
      <div
        className="collection-grid"
        id="collectionGrid"
        style={{
          opacity: fading ? 0 : 1,
          transition: 'opacity .2s ease',
        }}
      >
        {items.map((item, i) => (
          <div
            className="product-card"
            key={i}
          >
            <div className="product-img-wrap">
              <div className="product-placeholder">
                {item.emoji}
              </div>

              {item.badge && (
                <div
                  className="product-badge"
                  style={{
                    background: item.bc,
                  }}
                >
                  {item.badge}
                </div>
              )}
            </div>

            <div className="product-info">
              <h3>{item.name}</h3>

              <p>{item.desc}</p>

              <div className="product-price">
                {item.price}
              </div>
            </div>

            <button
              className="product-card-btn"
              onClick={() => handleAddToCart(item)}
            >
              Commander cette pièce →
            </button>
          </div>
        ))}
      </div>

      {/* CRÉATION SPÉCIALE */}
      <div
        style={{
          margin: '3rem 0 2rem',
          padding: '2rem',
          border: '1px solid rgba(212,169,74,.35)',
          background: 'var(--white)',
          textAlign: 'center',
        }}
      >
        <div className="section-label">
          Création personnalisée
        </div>

        <h2
          style={{
            fontFamily: 'var(--ff-display)',
            color: 'var(--chocolate)',
            marginBottom: '.8rem',
          }}
        >
          Une pièce <em>unique</em> en tête ?
        </h2>

        <p
          style={{
            maxWidth: '700px',
            margin: '0 auto 1.3rem',
            color: 'var(--muted)',
            fontSize: '.9rem',
            lineHeight: 1.7,
          }}
        >
          Vous avez une idée particulière qui ne figure
          pas dans notre collection ? Décrivez-nous votre
          projet et notre crocheteuse étudiera votre demande.
        </p>

        {/* INFORMATION PRIX */}
        <div
          style={{
            maxWidth: '650px',
            margin: '0 auto 1.5rem',
            padding: '1rem 1.2rem',
            background: 'rgba(212,169,74,.08)',
            borderLeft: '3px solid var(--terracotta)',
            textAlign: 'left',
            fontSize: '.82rem',
            lineHeight: 1.7,
            color: 'var(--chocolate)',
          }}
        >
          <strong>
            À savoir concernant le prix
          </strong>

          <br />
          <br />

          Le prix d'une création spéciale n'est pas fixé
          à l'avance. Il sera déterminé après étude de votre
          projet selon l'envergure de la pièce, les matières,
          la complexité du modèle et le temps nécessaire à
          sa réalisation.

          <br />
          <br />

          <strong>
            Aucun acompte ne sera demandé avant cette estimation.
          </strong>
        </div>

        <button
          className="btn"
          onClick={() => goTo('commander')}
        >
          <span>
            Demander une pièce spéciale →
          </span>

          <svg
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <FooterSimple text="Fait main avec ❤" />
    </div>
  );
}