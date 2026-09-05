import { useState } from 'react';
import BackButton from '../components/BackButton';
import { FooterSimple } from '../components/Footer';
import { collectionItems } from '../data';

const FILTERS = [
  { key: 'all', label: 'Tout' },
  { key: 'robes', label: 'Robes' },
  { key: 'tops', label: 'Tops' },
  { key: 'ensembles', label: 'Ensembles' },
  { key: 'sacs', label: 'Sacs' },
];

export default function Collection({
  goTo,
  goBack,
  showToast,
  addToCart,
  cartCount = 0,
}) {
  const [cat, setCat] = useState('all');
  const [fading, setFading] = useState(false);

  const items =
    cat === 'all'
      ? collectionItems
      : collectionItems.filter((item) => item.cat === cat);

  const filterCollection = (key) => {
    setFading(true);

    window.setTimeout(() => {
      setCat(key);
      setFading(false);
    }, 200);
  };

  const openSpecialRequest = () => {
    goTo('commander');

    // Commander écoute cet événement et ouvre directement
    // la zone où le client décrit son projet.
    window.setTimeout(() => {
      window.dispatchEvent(new Event('open-special-request'));
    }, 50);
  };

  const handleAddToCart = (item) => {
    addToCart({
      id: `${item.name}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 7)}`,
      name: item.name,
      emoji: item.emoji,
      price: item.price,
      cat: item.cat,
      // Détermine si Commander doit proposer taille/couleur (vêtements
      // en crochet) ou une commande simple (sacs en wax).
      material: item.material || (item.cat === 'sacs' ? 'wax' : 'crochet'),
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
          {FILTERS.map((filter) => (
            <button
              key={filter.key}
              className={`filter-btn ${
                cat === filter.key ? 'active' : ''
              }`}
              onClick={() => filterCollection(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* RETOUR */}
      <BackButton
        label="Retour à l'accueil"
        onClick={() => goBack('accueil')}
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
        {items.map((item, index) => (
          <div className="product-card" key={index}>
            <div className="product-img-wrap">
              <div className="product-placeholder">
                {item.emoji}
              </div>

              {item.badge && (
                <div
                  className="product-badge"
                  style={{ background: item.bc }}
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
              <span>Commander cette pièce</span>

              <svg
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* CRÉATION SPÉCIALE */}
      <section className="special-request-card">
        <div className="special-request-grid">
          <div className="special-request-content">
            <div className="special-request-heading">
              <div className="section-label">
                Création sur mesure
              </div>
            </div>

            <h2>
              Une pièce <em>unique</em> en tête ?
            </h2>

            <p>
              Vous avez une idée qui ne figure pas dans la
              collection ? Décrivez-la directement dans votre
              demande — vous pourrez aussi joindre une photo
              d'inspiration.
            </p>

            <button
              className="btn btn-fill"
              onClick={openSpecialRequest}
            >
              <span>Décrire ma création spéciale</span>

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

          <div className="special-request-info">
            <span className="special-request-icon" aria-hidden="true">🧶</span>
            <div className="special-request-info-title">
              À savoir
            </div>

            <p>
              Le prix est défini après étude selon la pièce,
              les matières, la complexité et le temps de
              réalisation.
            </p>

            <strong>
              Aucun acompte avant l'estimation.
            </strong>
          </div>
        </div>
      </section>

      <FooterSimple text="Fait main avec ❤" />
    </div>
  );
}