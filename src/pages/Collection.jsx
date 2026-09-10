import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
  // Article actuellement survolé (desktop uniquement) : déclenche
  // l'aperçu flottant en grand, façon story Instagram — sans naviguer
  // vers une fiche produit.
  // Aperçu déclenché par un appui long tactile (mobile) — affiché à
  // l'endroit même de la carte touchée (pas centré sur l'écran),
  // l'équivalent du "survol pour prévisualiser" d'Instagram sur les
  // réels : on maintient le doigt pour voir la création en grand à sa
  // position, on relâche pour fermer, sans jamais ouvrir de fiche produit.
  const [preview, setPreview] = useState(null); // { item, rect }
  const pressTimer = useRef(null);
  const touchStartPos = useRef({ x: 0, y: 0 });
  const pendingRectRef = useRef(null);

  const handleTouchStart = (item, e) => {
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    pendingRectRef.current = e.currentTarget.getBoundingClientRect();

    pressTimer.current = window.setTimeout(() => {
      setPreview({ item, rect: pendingRectRef.current });
    }, 180);
  };

  const handleTouchMove = (e) => {
    // Si le doigt bouge (scroll), on annule l'aperçu pour ne pas
    // gêner le défilement de la page.
    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - touchStartPos.current.x);
    const dy = Math.abs(touch.clientY - touchStartPos.current.y);

    if (dx > 10 || dy > 10) {
      clearTimeout(pressTimer.current);
      setPreview(null);
    }
  };

  const handleTouchEnd = () => {
    clearTimeout(pressTimer.current);
    setPreview(null);
  };

  // Calcule la position/taille de l'aperçu à partir de la carte
  // touchée : agrandi (×1.6) mais ancré à sa position d'origine, avec
  // une marge de sécurité pour ne jamais sortir de l'écran.
  const getPreviewStyle = (rect) => {
    if (!rect || typeof window === 'undefined') return {};

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = 12;
    const navSafeTop = 84;

    const width = Math.min(rect.width * 1.6, vw * 0.82, 340);
    const estimatedHeight = width * 1.25 + 110;
    const centerX = rect.left + rect.width / 2;

    let left = centerX - width / 2;
    left = Math.max(margin, Math.min(left, vw - width - margin));

    let top = rect.top - 16;
    top = Math.max(navSafeTop, Math.min(top, vh - estimatedHeight - margin));

    return { left: `${left}px`, top: `${top}px`, width: `${width}px` };
  };

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
          <div
            className="product-card"
            key={index}
            onTouchStart={(e) => handleTouchStart(item, e)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
          >
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

      {/* APERÇU TACTILE — s'affiche à l'endroit de la carte touchée
          (pas centré sur l'écran), appui long sur mobile uniquement. */}
      <AnimatePresence>
        {preview && (
          <motion.div
            className="hover-preview-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <motion.div
              className="hover-preview-card"
              style={getPreviewStyle(preview.rect)}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="hover-preview-media"
                style={{ background: preview.item.bc ? `linear-gradient(135deg, ${preview.item.bc}, var(--gold))` : 'linear-gradient(135deg, var(--gold), var(--terracotta))' }}
              >
                <span className="hover-preview-emoji">{preview.item.emoji}</span>
                {preview.item.badge && (
                  <span className="hover-preview-badge">{preview.item.badge}</span>
                )}
              </div>
              <div className="hover-preview-info">
                <h3>{preview.item.name}</h3>
                <p>{preview.item.desc}</p>
                <span className="hover-preview-price">{preview.item.price}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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