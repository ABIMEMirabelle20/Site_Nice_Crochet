import { useState } from 'react';
import BackButton from '../components/BackButton';
import { pieces, swatches, WHATSAPP_NUMBER } from '../data';

export default function Commander({ goTo, showToast }) {
  const [piece, setPiece] = useState(null);
  const [color, setColor] = useState('');
  const [colorAutre, setColorAutre] = useState('');
  const [taille, setTaille] = useState('');
  const [delai, setDelai] = useState('');
  const [notes, setNotes] = useState('');
  const [nom, setNom] = useState('');
  const [tel, setTel] = useState('');
  const [ville, setVille] = useState('');
  const [livraison, setLivraison] = useState('Remise en main propre à Cotonou');

  const couleurFinale = color === 'Autre' && colorAutre ? colorAutre : (color || '—');

  let step = 1;
  if (piece) step = 2;
  if (piece && couleurFinale !== '—') step = 3;
  if (piece && couleurFinale !== '—' && nom) step = 4;

  const total = piece ? piece.price : 0;
  const acompte = Math.round(total * 0.5);

  const validate = () => {
    if (!nom.trim() || !tel.trim() || !piece) {
      showToast('Veuillez remplir les champs obligatoires et choisir une pièce');
      return;
    }
    const msg = `Bonjour Nice Crochet ! Je souhaite passer une commande 🧶

— Pièce : ${piece.name}
— Couleur : ${couleurFinale === '—' ? 'non précisé' : couleurFinale}
— Taille : ${taille || 'non précisé'}
— Délai : ${delai || 'flexible'}
— Précisions : ${notes || 'aucune'}

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
          <h1>Passer une <em>commande</em></h1>
          <p>Sélectionnez votre pièce, personnalisez-la et envoyez-nous votre demande. Simple, rapide, sécurisé.</p>
        </div>
      </div>

      <div className="order-steps-bar">
        <div className="order-steps-inner">
          <div className={`ostep ${step >= 1 ? 'active' : ''}`}><div className="ostep-num">1</div>Votre pièce</div>
          <div className={`ostep ${step >= 2 ? 'active' : ''}`}><div className="ostep-num">2</div>Personnalisation</div>
          <div className={`ostep ${step >= 3 ? 'active' : ''}`}><div className="ostep-num">3</div>Vos coordonnées</div>
          <div className={`ostep ${step >= 4 ? 'active' : ''}`}><div className="ostep-num">4</div>Confirmation</div>
        </div>
      </div>

      <BackButton label="Retour à l'accueil" onClick={() => goTo('accueil')} />

      <div className="order-main">
        <div>
          <div className="order-section">
            <div className="order-section-title"><div className="os-num">1</div>Choisissez votre pièce</div>
            <div className="piece-selector">
              {pieces.map((p) => (
                <label className="piece-opt" key={p.name}>
                  <input type="radio" name="piece" checked={piece?.name === p.name} onChange={() => setPiece(p)} />
                  <div className="piece-opt-inner">
                    <div className="piece-opt-emoji">{p.emoji}</div>
                    <div className="piece-opt-info">
                      <div className="piece-opt-name">{p.name}</div>
                      <div className="piece-opt-price">{p.price > 0 ? `${p.price.toLocaleString()} FCFA` : 'Prix à définir'}</div>
                    </div>
                    <div className="piece-opt-check">✓</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="order-section">
            <div className="order-section-title"><div className="os-num">2</div>Personnalisez votre pièce</div>
            <div className="form-group">
              <label>Couleur souhaitée</label>
              <div className="color-swatches">
                {swatches.map((s) => (
                  <div
                    className={`swatch ${color === s.name ? 'selected' : ''}`}
                    key={s.name}
                    onClick={() => setColor(s.name)}
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
                value={colorAutre}
                onChange={(e) => setColorAutre(e.target.value)}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Taille</label>
                <select value={taille} onChange={(e) => setTaille(e.target.value)}>
                  <option value="">— Sélectionner —</option>
                  <option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>XXL</option><option>Sur mesure</option>
                </select>
              </div>
              <div className="form-group">
                <label>Délai souhaité</label>
                <select value={delai} onChange={(e) => setDelai(e.target.value)}>
                  <option value="">— Pas de préférence —</option>
                  <option>Le plus tôt possible</option>
                  <option>Sous 2 semaines</option>
                  <option>Sous 1 mois</option>
                  <option>Flexible</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Précisions & personnalisations</label>
              <textarea
                placeholder="Longueur souhaitée, modèle de référence vu sur nos réseaux, mensurations particulières, combinaison de couleurs..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="order-section">
            <div className="order-section-title"><div className="os-num">3</div>Vos coordonnées</div>
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

          <button className="btn btn-fill" style={{ width: '100%', justifyContent: 'center', padding: '1.1rem' }} onClick={validate}>
            <span>Envoyer ma commande par WhatsApp</span>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
          <p style={{ fontSize: '.75rem', color: 'var(--muted)', marginTop: '.8rem', textAlign: 'center' }}>Votre commande sera envoyée directement sur notre WhatsApp. Nous vous répondons sous 24h pour confirmer et vous donner les détails du paiement.</p>
        </div>

        <div className="order-recap">
          <h3>Votre commande</h3>
          <div className="recap-items">
            <div className="recap-row"><span>Pièce</span><span>{piece ? piece.name : '—'}</span></div>
            <div className="recap-row"><span>Couleur</span><span>{couleurFinale}</span></div>
            <div className="recap-row"><span>Taille</span><span>{taille || '—'}</span></div>
            <div className="recap-row recap-total"><span>Total</span><span>{piece ? (total > 0 ? `${total.toLocaleString()} FCFA` : 'À définir ensemble') : '—'}</span></div>
          </div>

          <div className="acompte-box">
            <div className="acompte-box-label">Acompte requis (50%)</div>
            <div className="acompte-amount">{piece ? (total > 0 ? `${acompte.toLocaleString()} FCFA` : 'À définir') : '—'}</div>
            <div className="acompte-detail">À verser avant le début de la confection pour réserver votre commande</div>
          </div>

          <div className="recap-contact">
            <strong>Paiement via</strong>
            MTN Mobile Money · Moov Money · Espèces
            <br /><br />
            <strong>Nous contacter</strong>
            <a href="https://wa.me/22990000000" target="_blank" rel="noreferrer">+229 90 00 00 00</a>
            <br />Réponse sous 24h · Livraison partout au Bénin
          </div>
        </div>
      </div>
    </div>
  );
}
