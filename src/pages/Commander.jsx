import { useState } from 'react';
import BackButton from '../components/BackButton';
import { swatches, WHATSAPP_NUMBER } from '../data';

function parsePrice(price) {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') {
    const digits = price.replace(/[^\d]/g, '');
    return digits ? parseInt(digits, 10) : 0;
  }
  return 0;
}

export default function Commander({ goTo, showToast, cart, updateCartItem, removeFromCart }) {
  const [nom, setNom] = useState('');
  const [tel, setTel] = useState('');
  const [ville, setVille] = useState('');
  const [livraison, setLivraison] = useState('Remise en main propre à Cotonou');
  const [acompteOk, setAcompteOk] = useState(false);

  const total = cart.reduce((sum, item) => sum + parsePrice(item.price), 0);
  const acompte = Math.round(total * 0.5);

  let step = 1;
  if (cart.length > 0) step = 2;
  if (cart.length > 0 && nom && tel) step = 3;
  if (cart.length > 0 && nom && tel && acompteOk) step = 4;

  const validate = () => {
    if (cart.length === 0) {
      showToast('Votre panier est vide');
      return;
    }
    const pieceSansTaille = cart.find((item) => !item.taille);
    if (pieceSansTaille) {
      showToast(`Veuillez préciser la taille pour "${pieceSansTaille.name}"`);
      return;
    }
    if (!nom.trim() || !tel.trim()) {
      showToast('Veuillez remplir votre nom et votre téléphone');
      return;
    }
    if (!acompteOk) {
      showToast("Veuillez confirmer l'acompte de 50% pour valider votre panier");
      return;
    }

    const lignes = cart.map((item, i) => {
      const couleurFinale = item.couleur === 'Autre' && item.couleurAutre ? item.couleurAutre : (item.couleur || 'non précisé');
      const prix = parsePrice(item.price);
      return `${i + 1}. ${item.name}
   — Taille : ${item.taille}
   — Couleur : ${couleurFinale}
   — Précisions : ${item.notes || 'aucune'}
   — Prix : ${prix > 0 ? `${prix.toLocaleString()} FCFA` : 'à définir'}`;
    }).join('\n\n');

    const msg = `Bonjour Nice Crochet ! Je souhaite passer commande 🧶

${lignes}

— Total : ${total > 0 ? `${total.toLocaleString()} FCFA` : 'à définir ensemble'}
— Acompte (50%) : ${total > 0 ? `${acompte.toLocaleString()} FCFA` : 'à définir'}

— Nom : ${nom}
— Téléphone : ${tel}
— Ville : ${ville || 'non précisé'}
— Livraison : ${livraison}`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="page active" id="page-commander">
      <div className="order-hero-wrap">
        <div className="order-hero-inner">
          <div className="section-label">Boutique Nice Crochet</div>
          <h1>Mon <em>panier</em></h1>
          <p>Vérifiez votre panier, précisez taille et couleur pour chaque pièce, puis validez avec l'acompte de 50%.</p>
        </div>
      </div>

      <div className="order-steps-bar">
        <div className="order-steps-inner">
          <div className={`ostep ${step >= 1 ? 'active' : ''}`}><div className="ostep-num">1</div>Votre panier</div>
          <div className={`ostep ${step >= 2 ? 'active' : ''}`}><div className="ostep-num">2</div>Personnalisation</div>
          <div className={`ostep ${step >= 3 ? 'active' : ''}`}><div className="ostep-num">3</div>Coordonnées</div>
          <div className={`ostep ${step >= 4 ? 'active' : ''}`}><div className="ostep-num">4</div>Confirmation</div>
        </div>
      </div>

      <BackButton label="Continuer mes achats" onClick={() => goTo('collection')} />

      <div className="order-main">
        <div>
          <div className="order-section">
            <div className="order-section-title"><div className="os-num">1</div>Pièces dans votre panier ({cart.length})</div>

            {cart.length === 0 && (
              <p style={{ fontSize: '.88rem', color: 'var(--muted)' }}>
                Votre panier est vide. <a onClick={() => goTo('collection')} style={{ color: 'var(--terracotta)', cursor: 'pointer', textDecoration: 'underline' }}>Parcourir la collection</a>
              </p>
            )}

            {cart.map((item) => {
              const prix = parsePrice(item.price);
              return (
                <div key={item.id} style={{ border: '1px solid rgba(212,169,74,.25)', padding: '1.5rem', marginBottom: '1.2rem', background: 'var(--white)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ fontFamily: 'var(--ff-display)', fontSize: '1.15rem', color: 'var(--chocolate)' }}>
                      {item.emoji} {item.name} — <span style={{ color: 'var(--chocolate-light)', fontSize: '.9rem' }}>{prix > 0 ? `${prix.toLocaleString()} FCFA` : 'Prix à définir'}</span>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} style={{ fontSize: '.7rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--terracotta)' }}>Retirer ✕</button>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Taille *</label>
                      <select value={item.taille} onChange={(e) => updateCartItem(item.id, { taille: e.target.value })}>
                        <option value="">— Sélectionner —</option>
                        <option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>XXL</option><option>Sur mesure</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Précisions (optionnel)</label>
                      <input type="text" placeholder="Longueur, modèle vu sur nos réseaux..." value={item.notes} onChange={(e) => updateCartItem(item.id, { notes: e.target.value })} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Couleur (si possible)</label>
                    <div className="color-swatches">
                      {swatches.map((s) => (
                        <div
                          className={`swatch ${item.couleur === s.name ? 'selected' : ''}`}
                          key={s.name}
                          onClick={() => updateCartItem(item.id, { couleur: s.name })}
                        >
                          <div className="swatch-circle" style={{ background: s.color, border: s.border ? '1px solid #ddd' : 'none' }}></div>
                          <div className="swatch-label">{s.name}</div>
                        </div>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Précisez si autre couleur..."
                      style={{ marginTop: '.5rem' }}
                      value={item.couleurAutre}
                      onChange={(e) => updateCartItem(item.id, { couleurAutre: e.target.value, couleur: 'Autre' })}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {cart.length > 0 && (
            <div className="order-section">
              <div className="order-section-title"><div className="os-num">2</div>Vos coordonnées</div>
              <div className="form-row">
                <div className="form-group"><label>Nom complet *</label><input type="text" placeholder="Votre nom et prénom" value={nom} onChange={(e) => setNom(e.target.value)} /></div>
                <div className="form-group"><label>Téléphone *</label><input type="tel" placeholder="+229 90 00 00 00" value={tel} onChange={(e) => setTel(e.target.value)} /></div>
              </div>
              <div className="form-group"><label>Quartier / Ville (pour la livraison)</label><input type="text" placeholder="Ex: Cotonou Cadjèhoun, Parakou..." value={ville} onChange={(e) => setVille(e.target.value)} /></div>
              <div className="form-group">
                <label>Mode de livraison</label>
                <div className="radio-group">
                  <label className="radio-opt"><input type="radio" name="livraison" checked={livraison === 'Remise en main propre à Cotonou'} onChange={() => setLivraison('Remise en main propre à Cotonou')} /> Remise en main propre à Cotonou</label>
                  <label className="radio-opt"><input type="radio" name="livraison" checked={livraison === 'Livraison à domicile'} onChange={() => setLivraison('Livraison à domicile')} /> Livraison à domicile</label>
                </div>
              </div>
            </div>
          )}

          {cart.length > 0 && (
            <>
              <label style={{ display: 'flex', gap: '.6rem', alignItems: 'flex-start', fontSize: '.82rem', color: 'var(--muted)', marginBottom: '1.2rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={acompteOk} onChange={(e) => setAcompteOk(e.target.checked)} style={{ marginTop: '.2rem' }} />
                Je comprends qu'un acompte de <strong style={{ color: 'var(--terracotta)' }}>50%</strong> est obligatoire pour valider et réserver mon panier. La confection démarre après réception de l'acompte.
              </label>

              <button className="btn btn-fill" style={{ width: '100%', justifyContent: 'center', padding: '1.1rem' }} onClick={validate}>
                <span>Valider mon panier par WhatsApp</span>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
              <p style={{ fontSize: '.75rem', color: 'var(--muted)', marginTop: '.8rem', textAlign: 'center' }}>Votre commande sera envoyée directement sur notre WhatsApp. Nous vous répondons sous 24h pour confirmer et vous donner les détails du paiement de l'acompte.</p>
            </>
          )}
        </div>

        <div className="order-recap">
          <h3>Récapitulatif</h3>
          <div className="recap-items">
            {cart.length === 0 && <div className="recap-row"><span>Panier</span><span>vide</span></div>}
            {cart.map((item) => (
              <div className="recap-row" key={item.id}>
                <span>{item.name}{item.taille ? ` (${item.taille})` : ''}</span>
                <span>{parsePrice(item.price) > 0 ? `${parsePrice(item.price).toLocaleString()} FCFA` : 'à définir'}</span>
              </div>
            ))}
            <div className="recap-row recap-total"><span>Total</span><span>{total > 0 ? `${total.toLocaleString()} FCFA` : '—'}</span></div>
          </div>

          <div className="acompte-box">
            <div className="acompte-box-label">Acompte requis (50%)</div>
            <div className="acompte-amount">{total > 0 ? `${acompte.toLocaleString()} FCFA` : '—'}</div>
            <div className="acompte-detail">À verser avant le début de la confection pour réserver votre panier</div>
          </div>

          <div className="recap-contact">
            <strong>Paiement via</strong>
            MTN Mobile Money · Moov Money · Espèces
            <br /><br />
            <strong>Nous contacter</strong>
            <a href="https://wa.me//22990614396" target="_blank" rel="noreferrer">+229 90614396</a>
            <br />Réponse sous 24h · Livraison partout au Bénin
          </div>
        </div>
      </div>
    </div>
  );
}