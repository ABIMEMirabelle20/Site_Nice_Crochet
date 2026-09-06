import { AnimatePresence, motion } from 'framer-motion';

function parsePrice(price) {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') {
    const digits = price.replace(/[^\d]/g, '');
    return digits ? parseInt(digits, 10) : 0;
  }
  return 0;
}

// Panier latéral affiché sur mobile via l'icône panier de la navbar.
// "Finaliser la commande" ramène vers la page Commander, où l'acompte
// et la validation se font (logique déjà gérée par Commander.jsx).
export default function CartSidebar({ open, onClose, cart, removeFromCart, onCheckout }) {
  const total = cart.reduce((sum, item) => sum + parsePrice(item.price), 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="cart-sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          <motion.aside
            className="cart-sidebar"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 32, mass: 0.8 }}
          >
            <div className="cart-sidebar-head">
              <h3>Mon panier {cart.length > 0 ? `(${cart.length})` : ''}</h3>
              <button className="cart-sidebar-close" onClick={onClose} aria-label="Fermer le panier">✕</button>
            </div>

            <div className="cart-sidebar-items">
              {cart.length === 0 ? (
                <p className="cart-sidebar-empty">Votre panier est vide.</p>
              ) : (
                cart.map((item) => {
                  const prix = parsePrice(item.price);
                  return (
                    <div className="cart-sidebar-item" key={item.id}>
                      <span className="cart-sidebar-item-emoji">{item.emoji}</span>
                      <div className="cart-sidebar-item-info">
                        <div className="cart-sidebar-item-name">{item.name}</div>
                        <div className="cart-sidebar-item-price">
                          {prix > 0 ? `${prix.toLocaleString('fr-FR')} FCFA` : 'Prix à définir'}
                        </div>
                      </div>
                      <button
                        className="cart-sidebar-item-remove"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Retirer ${item.name}`}
                      >
                        ✕
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-sidebar-footer">
                <div className="cart-sidebar-total">
                  <span>Total</span>
                  <span>{total > 0 ? `${total.toLocaleString('fr-FR')} FCFA` : '—'}</span>
                </div>
                <button className="btn btn-fill cart-sidebar-checkout" onClick={onCheckout}>
                  <span>Finaliser la commande</span>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}