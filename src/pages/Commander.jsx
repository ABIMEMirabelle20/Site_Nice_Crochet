import { useEffect, useRef, useState } from 'react';
import BackButton from '../components/BackButton';
import { swatches, WHATSAPP_NUMBER } from '../data';
import './DepositCard.css';

// URL du backend
const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:4000';

const KKIAPAY_PUBLIC_KEY =
  import.meta.env.VITE_KKIAPAY_PUBLIC_KEY || '';

const KKIAPAY_SANDBOX =
  import.meta.env.VITE_KKIAPAY_SANDBOX === 'true';

const DELAIS = [
  {
    id: 'standard',
    label: 'Délai standard (7 à 14 jours)',
    majoration: 0,
    note: 'Inclus dans le prix affiché',
  },
  {
    id: 'urgent',
    label: 'Urgent (3 à 5 jours)',
    majoration: 0.15,
    note: '+15% — travail accéléré',
  },
  {
    id: 'tres-urgent',
    label: 'Très urgent (24 à 48h)',
    majoration: 0.3,
    note: '+30% — veilles et heures supplémentaires',
  },
];

function parsePrice(price) {
  if (typeof price === 'number') {
    return price;
  }

  if (typeof price === 'string') {
    const digits = price.replace(/[^\d]/g, '');

    return digits
      ? parseInt(digits, 10)
      : 0;
  }

  return 0;
}

// Un sac (tissu wax) n'a ni taille ni couleur de mailles à choisir :
// on lui propose une commande simplifiée. Tout le reste (vêtements en
// crochet) garde le sélecteur taille + couleur.
function isBagItem(item) {
  return item.material === 'wax' || item.cat === 'sacs';
}

export default function Commander({
  goTo,
  goBack,
  showToast,
  cart,
  updateCartItem,
  removeFromCart,
}) {
  /* =========================
     COORDONNÉES
  ========================= */

  const [nom, setNom] = useState('');
  const [tel, setTel] = useState('');
  const [ville, setVille] = useState('');

  /* =========================
     CRÉATION SPÉCIALE
  ========================= */

  const [specialRequest, setSpecialRequest] =
    useState(false);

  const [specialDescription, setSpecialDescription] =
    useState('');

  // Photo d'inspiration jointe à la création spéciale. Un lien WhatsApp
  // (wa.me) ne peut pas transporter de fichier : l'aperçu est local et
  // le message généré indique clairement qu'il faut joindre la photo
  // manuellement une fois la conversation WhatsApp ouverte.
  const [specialImage, setSpecialImage] = useState(null);
  const [specialImagePreview, setSpecialImagePreview] = useState('');

  const handleSpecialImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (specialImagePreview) {
      URL.revokeObjectURL(specialImagePreview);
    }

    setSpecialImage(file);
    setSpecialImagePreview(URL.createObjectURL(file));
  };

  const removeSpecialImage = () => {
    if (specialImagePreview) {
      URL.revokeObjectURL(specialImagePreview);
    }
    setSpecialImage(null);
    setSpecialImagePreview('');
  };

  /* =========================
     LIVRAISON
  ========================= */

  const [livraison, setLivraison] = useState(
    'Remise en main propre à Cotonou'
  );

  const [adresseLivraison, setAdresseLivraison] =
    useState('');

  const [contactFin, setContactFin] =
    useState('');

  /* =========================
     DÉLAI
  ========================= */

  const [delaiId, setDelaiId] =
    useState('standard');

  /* =========================
     PAIEMENT
  ========================= */

  const [depositStatus, setDepositStatus] =
    useState('idle');

  const [depositInfo, setDepositInfo] =
    useState(null);

  const [orderId, setOrderId] =
    useState(null);

  const orderIdRef = useRef(null);

  /* =========================
     CALCULS
  ========================= */

  const sousTotal = cart.reduce(
    (sum, item) =>
      sum + parsePrice(item.price),
    0
  );

  const delaiChoisi =
    DELAIS.find(
      (d) => d.id === delaiId
    ) || DELAIS[0];

  const majoration = Math.round(
    sousTotal *
      delaiChoisi.majoration
  );

  const total =
    sousTotal + majoration;

  const acompte =
    Math.round(total * 0.5);

  const isLivraisonDomicile =
    livraison === 'Livraison à domicile';

  const depositDeclared =
    depositStatus === 'confirmed';

  /*
   * Une création spéciale ne possède pas encore
   * de prix et ne demande donc aucun acompte.
   * Sacs et vêtements suivent tous les deux le même
   * circuit d'acompte à 50% dès qu'ils sont dans le panier.
   */
  const requiresDeposit =
    !specialRequest && cart.length > 0;

  /* =========================
     ÉTAPES
  ========================= */

  let step = 1;

  if (cart.length > 0) {
    step = 2;
  }

  if (
    cart.length > 0 &&
    nom &&
    tel
  ) {
    step = 3;
  }

  if (
    depositDeclared ||
    specialRequest
  ) {
    step = 4;
  }

  /* =========================
     VÉRIFICATION PAIEMENT
  ========================= */

  const pollOrderStatus = async (
    id,
    attempt = 0
  ) => {
    try {
      const res = await fetch(
        `${API_URL}/api/orders/${id}/status`
      );

      const data = await res.json();

      if (
        data.statutPaiement ===
        'approuve'
      ) {
        setDepositInfo({
          montant: data.montant,
          reference: data.reference,
          mode: data.mode,
          confirmedAt:
            data.confirmedAt,
        });

        setDepositStatus(
          'confirmed'
        );

        showToast(
          'Paiement confirmé par notre système ✅'
        );

        return;
      }

      if (
        data.statutPaiement ===
          'refuse' ||
        data.statutPaiement ===
          'annule'
      ) {
        setDepositStatus('error');

        showToast(
          'Le paiement a été refusé ou annulé. Veuillez réessayer.'
        );

        return;
      }

      if (attempt < 6) {
        setTimeout(
          () =>
            pollOrderStatus(
              id,
              attempt + 1
            ),
          2000
        );
      } else {
        setDepositStatus('error');

        showToast(
          "Vérification en cours côté serveur. Réessayez dans un instant ou contactez-nous si le montant a bien été débité."
        );
      }
    } catch {
      setDepositStatus('error');

      showToast(
        'Impossible de vérifier le paiement pour le moment. Réessayez.'
      );
    }
  };

  /* =========================
     VÉRIFICATION KKIAPAY
  ========================= */

  const verifyOnBackend = async (
    transactionId
  ) => {
    const id =
      orderIdRef.current;

    if (!id) return;

    setDepositStatus('checking');

    try {
      await fetch(
        `${API_URL}/api/orders/${id}/verify-kkiapay`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            transactionId,
          }),
        }
      );
    } catch {
      // Le polling continue même si la réponse échoue.
    }

    pollOrderStatus(id);
  };

  useEffect(() => {
    if (
      !window.addSuccessListener
    ) {
      return;
    }

    const handler = (response) => {
      verifyOnBackend(
        response.transactionId
      );
    };

    window.addSuccessListener(
      handler
    );
  }, []);

  // Ouverture directe de la zone « création spéciale »
  // depuis la page Collection.
  useEffect(() => {
    const openSpecialRequest = () => {
      setSpecialRequest(true);

      window.setTimeout(() => {
        document
          .getElementById('special-description')
          ?.focus();
      }, 120);
    };

    window.addEventListener(
      'open-special-request',
      openSpecialRequest
    );

    return () =>
      window.removeEventListener(
        'open-special-request',
        openSpecialRequest
      );
  }, []);

  // Nettoyage de l'URL d'aperçu de l'image au démontage.
  useEffect(() => {
    return () => {
      if (specialImagePreview) {
        URL.revokeObjectURL(specialImagePreview);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =========================
     PAIEMENT ACOMPTE
  ========================= */

  const handlePayDeposit = async () => {
    if (specialRequest) {
      showToast(
        "Aucun acompte n'est demandé pour une création spéciale."
      );
      return;
    }

    if (
      !window.openKkiapayWidget
    ) {
      showToast(
        "Le module de paiement n'a pas pu se charger. Rechargez la page et réessayez."
      );

      return;
    }

    if (acompte <= 0) {
      return;
    }

    setDepositStatus('creating');

    try {
      const res = await fetch(
        `${API_URL}/api/orders`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            client: {
              nom,
              tel,
              ville,
              livraison,
              adresseLivraison,
              contactFin,
            },

            items: cart.map(
              (item) => ({
                name: item.name,
                taille: isBagItem(item)
                  ? '—'
                  : item.taille,
                couleur: isBagItem(item)
                  ? '—'
                  : item.couleur ===
                    'Autre'
                    ? item.couleurAutre
                    : item.couleur,
                notes:
                  item.notes || '',
                prix:
                  parsePrice(
                    item.price
                  ),
              })
            ),

            delai:
              delaiChoisi.label,

            majoration,
            total,
            acompte,
          }),
        }
      );

      if (!res.ok) {
        throw new Error(
          'order_create_failed'
        );
      }

      const data =
        await res.json();

      setOrderId(
        data.orderId
      );

      orderIdRef.current =
        data.orderId;

      setDepositStatus('paying');

      window.openKkiapayWidget({
        amount: acompte,
        key: KKIAPAY_PUBLIC_KEY,
        sandbox:
          KKIAPAY_SANDBOX,
        position: 'center',
        reason:
          `Acompte commande Nice Crochet #${data.orderId}`,
        data: JSON.stringify({
          orderId:
            data.orderId,
        }),
      });
    } catch {
      setDepositStatus('error');

      showToast(
        "Impossible de lancer le paiement. Vérifiez votre connexion et réessayez."
      );
    }
  };

  /* =========================
     VALIDATION
  ========================= */

  const validate = () => {
    if (
      cart.length === 0 &&
      !specialRequest
    ) {
      showToast(
        'Votre panier est vide'
      );

      return;
    }

    if (
      cart.length > 0
    ) {
      const pieceSansTaille =
        cart.find(
          (item) =>
            !isBagItem(item) &&
            !item.taille
        );

      if (pieceSansTaille) {
        showToast(
          `Veuillez préciser la taille pour "${pieceSansTaille.name}"`
        );

        return;
      }
    }

    if (
      specialRequest &&
      !specialDescription.trim()
    ) {
      showToast(
        'Veuillez décrire votre création spéciale avant de valider.'
      );

      return;
    }

    if (
      !nom.trim() ||
      !tel.trim()
    ) {
      showToast(
        'Veuillez remplir votre nom et votre téléphone'
      );

      return;
    }

    if (
      isLivraisonDomicile &&
      (
        !adresseLivraison.trim() ||
        !contactFin.trim()
      )
    ) {
      showToast(
        "Veuillez préciser l'adresse de livraison et le numéro à contacter une fois le travail terminé"
      );

      return;
    }

    /*
     * Acompte pour toute commande normale (sacs comme vêtements).
     */
    if (
      requiresDeposit &&
      !depositDeclared
    ) {
      showToast(
        "Veuillez régler l'acompte avant de valider votre commande"
      );

      return;
    }

    /* =========================
       MESSAGE WHATSAPP
       (reconstruit en blocs filtrés
       pour éviter répétitions et
       sections vides)
    ========================= */

    const piecesPart =
      cart.length > 0
        ? cart
            .map((item, i) => {
              const bag = isBagItem(item);

              const couleurFinale = bag
                ? null
                : item.couleur === 'Autre' &&
                  item.couleurAutre
                  ? item.couleurAutre
                  : item.couleur ||
                    'non précisé';

              const prix = parsePrice(
                item.price
              );

              const detailLines = [
                !bag &&
                  `   — Taille : ${item.taille}`,
                !bag &&
                  `   — Couleur : ${couleurFinale}`,
                `   — Précisions : ${
                  item.notes || 'aucune'
                }`,
                `   — Prix : ${
                  prix > 0
                    ? `${prix.toLocaleString()} FCFA`
                    : 'à définir'
                }`,
              ]
                .filter(Boolean)
                .join('\n');

              return `${i + 1}. ${item.name}\n${detailLines}`;
            })
            .join('\n\n')
        : null;

    const specialImageNote = specialRequest && specialImage
      ? `\n📎 Une photo d'inspiration est prête à être envoyée : merci de la joindre manuellement à ce message une fois la conversation WhatsApp ouverte (fichier : ${specialImage.name}).`
      : '';

    const specialPart = specialRequest
      ? `✨ Création spéciale
— Description de la création : ${specialDescription}${specialImageNote}`
      : null;

    const refSuffix =
      depositInfo?.reference || orderId
        ? ` (réf : ${
            depositInfo?.reference ||
            orderId
          })`
        : '';

    const acompteLine = !specialRequest
      ? `— Acompte (50%) : ${
          acompte > 0
            ? `${acompte.toLocaleString()} FCFA versé via ${
                depositInfo?.mode ||
                'Mobile Money'
              } (numéro : ${tel})${refSuffix}`
            : 'à définir'
        }`
      : null;

    const totauxPart = !specialRequest
      ? [
          `— Sous-total : ${
            sousTotal > 0
              ? `${sousTotal.toLocaleString()} FCFA`
              : 'à définir'
          }`,
          `— Délai : ${
            delaiChoisi.label
          }${
            majoration > 0
              ? ` (majoration +${majoration.toLocaleString()} FCFA)`
              : ''
          }`,
          `— Total : ${
            total > 0
              ? `${total.toLocaleString()} FCFA`
              : 'à définir'
          }`,
          acompteLine,
        ]
          .filter(Boolean)
          .join('\n')
      : null;

    const livraisonLine =
      isLivraisonDomicile
        ? `— Livraison à domicile — Adresse : ${adresseLivraison} (contact fin de travaux : ${contactFin})`
        : `— Livraison : Remise en main propre à Cotonou`;

    const clientPart = `— Nom : ${nom}
— Téléphone : ${tel}
— Ville : ${ville || 'non précisé'}
${livraisonLine}`;

    const msg = [
      'Bonjour Nice Crochet ! Je souhaite passer commande 🧶',
      specialPart,
      piecesPart,
      totauxPart,
      clientPart,
    ]
      .filter(Boolean)
      .join('\n\n');

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        msg
      )}`,
      '_blank'
    );

    showToast(
      specialRequest && specialImage
        ? "Commande envoyée sur WhatsApp ! N'oubliez pas de joindre votre photo."
        : 'Commande envoyée sur WhatsApp !'
    );
  };

  /* =========================
     TEXTE BOUTON PAIEMENT
  ========================= */

  const depositButtonLabel = {
    idle:
      "Payer l'acompte via Mobile Money",
    creating:
      'Préparation du paiement…',
    paying:
      'Paiement en cours…',
    checking:
      'Vérification du paiement…',
    error:
      'Réessayer le paiement',
  }[depositStatus] ||
    "Payer l'acompte via Mobile Money";

  /* =========================
     RENDER
  ========================= */

  return (
    <div
      className="page active"
      id="page-commander"
    >

      {/* HERO */}
      <div className="order-hero-wrap">
        <div className="order-hero-inner">

          <div className="section-label">
            Boutique Nice Crochet
          </div>

          <h1>
            Ma <em>commande</em>
          </h1>

          <p>
            Vérifiez vos pièces, précisez
            les détails nécessaires et
            renseignez vos coordonnées.
          </p>

        </div>
      </div>

      {/* ÉTAPES */}
      <div className="order-steps-bar">
        <div className="order-steps-inner">

          <div
            className={`ostep ${
              step >= 1
                ? 'active'
                : ''
            }`}
          >
            <div className="ostep-num">
              1
            </div>
            Votre panier
          </div>

          <div
            className={`ostep ${
              step >= 2
                ? 'active'
                : ''
            }`}
          >
            <div className="ostep-num">
              2
            </div>
            Coordonnées
          </div>

          <div
            className={`ostep ${
              step >= 3
                ? 'active'
                : ''
            }`}
          >
            <div className="ostep-num">
              3
            </div>
            Paiement
          </div>

          <div
            className={`ostep ${
              step >= 4
                ? 'active'
                : ''
            }`}
          >
            <div className="ostep-num">
              4
            </div>
            Validation
          </div>

        </div>
      </div>

      <BackButton
        label="Continuer mes achats"
        onClick={() =>
          goBack('collection')
        }
      />

      <div className="order-main">

        {/* =========================
            COLONNE PRINCIPALE
        ========================= */}

        <div className="order-main-content">

          {/* PANIER */}
          <div className="order-section">

            <div className="order-section-title">
              <div className="os-num">
                1
              </div>

              Pièces dans votre panier (
              {cart.length}
              )
            </div>

            {cart.length === 0 && (
              <p
                style={{
                  fontSize: '.88rem',
                  color: 'var(--muted)',
                }}
              >
                Votre panier est vide.{' '}

                <a
                  onClick={() =>
                    goTo(
                      'collection'
                    )
                  }
                  style={{
                    color:
                      'var(--terracotta)',
                    cursor:
                      'pointer',
                    textDecoration:
                      'underline',
                  }}
                >
                  Parcourir la collection
                </a>
              </p>
            )}

            {cart.map((item) => {
              const prix =
                parsePrice(
                  item.price
                );

              const bag = isBagItem(item);

              return (
                <div
                  key={item.id}
                  className="cart-item-card"
                >

                  <div className="cart-item-head">

                    <div className="cart-item-title">
                      <span className="cart-item-emoji">{item.emoji}</span>
                      {item.name}{' '}

                      <span className="cart-item-price">
                        —
                        {' '}
                        {prix > 0
                          ? `${prix.toLocaleString()} FCFA`
                          : 'Prix à définir'}
                      </span>

                      {bag && (
                        <span className="cart-item-tag">Sac (wax)</span>
                      )}
                    </div>

                    <button
                      className="cart-item-remove"
                      onClick={() =>
                        removeFromCart(
                          item.id
                        )
                      }
                    >
                      Retirer ✕
                    </button>

                  </div>

                  {bag ? (
                    /* Commande simplifiée pour les sacs : pas de taille
                       ni de couleur de mailles à choisir. */
                    <div className="form-group">
                      <label>
                        Précisions (optionnel)
                      </label>

                      <input
                        type="text"
                        placeholder="Motif souhaité, doublure, taille du sac..."
                        value={
                          item.notes ||
                          ''
                        }
                        onChange={(e) =>
                          updateCartItem(
                            item.id,
                            {
                              notes:
                                e.target
                                  .value,
                            }
                          )
                        }
                      />
                    </div>
                  ) : (
                    <>
                      <div className="form-row">

                        <div className="form-group">
                          <label>
                            Taille *
                          </label>

                          <select
                            value={
                              item.taille
                            }
                            onChange={(e) =>
                              updateCartItem(
                                item.id,
                                {
                                  taille:
                                    e.target
                                      .value,
                                }
                              )
                            }
                          >
                            <option value="">
                              — Sélectionner —
                            </option>

                            <option>
                              XS
                            </option>
                            <option>
                              S
                            </option>
                            <option>
                              M
                            </option>
                            <option>
                              L
                            </option>
                            <option>
                              XL
                            </option>
                            <option>
                              XXL
                            </option>
                            <option>
                              Sur mesure
                            </option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>
                            Précisions
                            (optionnel)
                          </label>

                          <input
                            type="text"
                            placeholder="Détails, ajustements..."
                            value={
                              item.notes ||
                              ''
                            }
                            onChange={(e) =>
                              updateCartItem(
                                item.id,
                                {
                                  notes:
                                    e.target
                                      .value,
                                }
                              )
                            }
                          />
                        </div>

                      </div>

                      <div className="form-group">

                        <label>
                          Couleur
                        </label>

                        <div className="swatch-grid">
                          {swatches.map(
                            (sw) => (
                              <button
                                key={
                                  sw.name
                                }
                                type="button"
                                title={
                                  sw.name
                                }
                                className={`swatch-dot ${
                                  item.couleur === sw.name
                                    ? 'is-selected'
                                    : ''
                                } ${sw.border ? 'has-border' : ''}`}
                                onClick={() =>
                                  updateCartItem(
                                    item.id,
                                    {
                                      couleur:
                                        sw.name,
                                    }
                                  )
                                }
                                style={{
                                  background:
                                    sw.color,
                                }}
                              />
                            )
                          )}
                        </div>

                        <input
                          type="text"
                          className="swatch-custom-input"
                          placeholder="Vous ne trouvez pas votre couleur ? Décrivez-la ici..."
                          value={
                            item.couleurAutre ||
                            ''
                          }
                          onChange={(e) =>
                            updateCartItem(
                              item.id,
                              {
                                couleurAutre:
                                  e.target
                                    .value,
                                couleur:
                                  'Autre',
                              }
                            )
                          }
                        />

                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* CRÉATION SPÉCIALE */}
          <div className={`order-section special-request-section ${
            specialRequest ? 'is-active' : ''
          }`}>
            <div className="order-section-title">
              <div className="os-num">★</div>
              Création spéciale
            </div>

            {!specialRequest ? (
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setSpecialRequest(true);

                  window.setTimeout(() => {
                    document
                      .getElementById('special-description')
                      ?.focus();
                  }, 120);
                }}
              >
                <span>Décrire une création spéciale</span>
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
            ) : (
              <div className="special-request-form">
                <p className="special-request-help">
                  Décrivez simplement la pièce souhaitée :
                  modèle, couleur, dimensions ou inspiration.
                </p>

                <div className="form-group">
                  <label htmlFor="special-description">
                    Votre projet *
                  </label>

                  <textarea
                    id="special-description"
                    rows="6"
                    placeholder="Ex. Une robe longue au crochet, couleur crème, manches courtes, avec un motif floral..."
                    value={specialDescription}
                    onChange={(e) =>
                      setSpecialDescription(e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label>
                    Photo d'inspiration (optionnel)
                  </label>

                  {!specialImagePreview ? (
                    <label className="special-upload-zone">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSpecialImageChange}
                        hidden
                      />
                      <span className="special-upload-icon">📷</span>
                      <span>Cliquez pour choisir une image</span>
                    </label>
                  ) : (
                    <div className="special-upload-preview">
                      <img src={specialImagePreview} alt="Aperçu de l'inspiration" />
                      <button
                        type="button"
                        className="special-upload-remove"
                        onClick={removeSpecialImage}
                      >
                        Retirer la photo ✕
                      </button>
                    </div>
                  )}

                  <p className="special-upload-note">
                    WhatsApp ne permet pas de joindre automatiquement une
                    image via ce lien : gardez-la sous la main, il vous
                    suffira de l'ajouter en une touche dans la conversation
                    WhatsApp qui s'ouvrira à la validation.
                  </p>
                </div>

                <button
                  type="button"
                  className="special-cancel-btn"
                  onClick={() => {
                    setSpecialRequest(false);
                    setSpecialDescription('');
                    removeSpecialImage();
                  }}
                >
                  Annuler
                </button>
              </div>
            )}
          </div>

          {/* =========================
              COORDONNÉES
          ========================= */}

          {(cart.length > 0 ||
            specialRequest) && (
            <div className="order-section">

              <div className="order-section-title">
                <div className="os-num">
                  2
                </div>

                Vos coordonnées
              </div>

              <div className="form-row">

                <div className="form-group">
                  <label>
                    Nom complet *
                  </label>

                  <input
                    type="text"
                    placeholder="Votre nom et prénom"
                    value={nom}
                    onChange={(e) =>
                      setNom(
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="form-group">
                  <label>
                    Téléphone *
                  </label>

                  <input
                    type="tel"
                    placeholder="+229 90 00 00 00"
                    value={tel}
                    onChange={(e) =>
                      setTel(
                        e.target.value
                      )
                    }
                  />
                </div>

              </div>

              <div className="form-group">
                <label>
                  Quartier / Ville
                  (pour la livraison)
                </label>

                <input
                  type="text"
                  placeholder="Ex: Cotonou Cadjèhoun, Parakou..."
                  value={ville}
                  onChange={(e) =>
                    setVille(
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="form-group">

                <label>
                  Mode de livraison
                </label>

                <div className="radio-group">

                  <label className="radio-opt">
                    <input
                      type="radio"
                      name="livraison"
                      checked={
                        livraison ===
                        'Remise en main propre à Cotonou'
                      }
                      onChange={() =>
                        setLivraison(
                          'Remise en main propre à Cotonou'
                        )
                      }
                    />

                    Remise en main propre
                    à Cotonou
                  </label>

                  <label className="radio-opt">
                    <input
                      type="radio"
                      name="livraison"
                      checked={
                        isLivraisonDomicile
                      }
                      onChange={() =>
                        setLivraison(
                          'Livraison à domicile'
                        )
                      }
                    />

                    Livraison à domicile
                  </label>

                </div>
              </div>

              {isLivraisonDomicile && (
                <div className="form-row">

                  <div className="form-group">

                    <label>
                      *Adresse précise
                      de livraison
                    </label>

                    <input
                      type="text"
                      placeholder="Rue, repère, quartier détaillé..."
                      value={
                        adresseLivraison
                      }
                      onChange={(e) =>
                        setAdresseLivraison(
                          e.target
                            .value
                        )
                      }
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      *Numéro à contacter
                      une fois le travail
                      terminé
                    </label>

                    <input
                      type="tel"
                      placeholder="+229 90 00 00 00"
                      value={
                        contactFin
                      }
                      onChange={(e) =>
                        setContactFin(
                          e.target
                            .value
                        )
                      }
                    />

                  </div>

                </div>
              )}

              <div className="form-group">

                <label>
                  Délai de livraison
                  souhaité
                </label>

                <div className="radio-group">

                  {DELAIS.map((d) => (
                    <label
                      key={d.id}
                      className="radio-opt"
                    >
                      <input
                        type="radio"
                        name="delai"
                        checked={
                          delaiId ===
                          d.id
                        }
                        onChange={() =>
                          setDelaiId(
                            d.id
                          )
                        }
                      />

                      {' '}
                      {d.label}

                      {d.majoration >
                        0 &&
                        ` (${d.note})`}
                    </label>
                  ))}

                </div>

                <p
                  className="deposit-card-help"
                  style={{
                    marginTop:
                      '.6rem',
                  }}
                >
                  Un délai court
                  demande à notre
                  crocheteuse de
                  travailler en heures
                  supplémentaires ou
                  en veillée pour
                  respecter votre
                  échéance.
                </p>

              </div>
            </div>
          )}

          {/* =========================
              ACOMPTE
              UNIQUEMENT SI PAS
              DE CRÉATION SPÉCIALE
          ========================= */}

          {cart.length > 0 &&
            nom &&
            tel &&
            !specialRequest && (
              <div className="order-section">

                <div className="order-section-title">
                  <div className="os-num">
                    3
                  </div>

                  Paiement de l'acompte
                  (50%)
                </div>

                {!depositDeclared ? (
                  <div className="deposit-card">

                    <div className="deposit-card-label">
                      Montant à verser
                    </div>

                    <div className="deposit-card-amount">
                      {total > 0
                        ? `${acompte.toLocaleString()} FCFA`
                        : '—'}
                    </div>

                    <p className="deposit-card-help">
                      Paiement sécurisé
                      par MTN Mobile Money,
                      Moov Money ou carte
                      bancaire (Kkiapay).

                      <br />
                      <br />

                      Le paiement est
                      vérifié automatiquement
                      par notre système.
                    </p>

                    <button
                      type="button"
                      className="btn btn-fill"
                      style={{
                        width:
                          '100%',
                        justifyContent:
                          'center',
                        padding:
                          '1.1rem',
                      }}
                      onClick={
                        handlePayDeposit
                      }
                      disabled={
                        acompte <= 0 ||
                        [
                          'creating',
                          'paying',
                          'checking',
                        ].includes(
                          depositStatus
                        )
                      }
                    >
                      <span>
                        {
                          depositButtonLabel
                        }
                      </span>
                    </button>

                  </div>
                ) : (
                  <div className="deposit-confirmed">

                    <div className="deposit-confirmed-icon">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </div>

                    <div>

                      <div className="deposit-confirmed-title">
                        Paiement confirmé
                      </div>

                      <div className="deposit-confirmed-sub">
                        {depositInfo?.montant
                          ? `${Number(
                              depositInfo.montant
                            ).toLocaleString()} FCFA`
                          : ''}{' '}
                        reçu et vérifié
                        par notre système
                      </div>

                    </div>

                  </div>
                )}

              </div>
            )}

        </div>

        {/* =========================
            RÉCAPITULATIF
        ========================= */}

        <div className="order-recap">

          <h3>
            Récapitulatif
          </h3>

          <div className="recap-items">

            {cart.length === 0 && (
              <div className="recap-row">
                <span>
                  Panier
                </span>

                <span>
                  vide
                </span>
              </div>
            )}

            {cart.map((item) => (
              <div
                className="recap-row"
                key={item.id}
              >
                <span>
                  {item.name}

                  {item.taille
                    ? ` (${item.taille})`
                    : ''}
                </span>

                <span>
                  {parsePrice(
                    item.price
                  ) > 0
                    ? `${parsePrice(
                        item.price
                      ).toLocaleString()} FCFA`
                    : 'à définir'}
                </span>
              </div>
            ))}

            {specialRequest && (
              <div className="recap-special">
                <strong>✨ Création spéciale</strong>
                <span>Prix à définir après étude</span>
              </div>
            )}

            {majoration > 0 &&
              !specialRequest && (
                <div className="recap-row">

                  <span>
                    Majoration délai
                  </span>

                  <span>
                    +
                    {majoration.toLocaleString()}{' '}
                    FCFA
                  </span>

                </div>
              )}

            {!specialRequest && (
              <div className="recap-row recap-total">

                <span>
                  Total
                </span>

                <span>
                  {total > 0
                    ? `${total.toLocaleString()} FCFA`
                    : '—'}
                </span>

              </div>
            )}

          </div>

          {/* ACOMPTE */}
          {!specialRequest && (

            <div className="acompte-box">

              <div className="acompte-box-label">
                Acompte requis (50%)
              </div>

              <div className="acompte-amount">
                {total > 0
                  ? `${acompte.toLocaleString()} FCFA`
                  : '—'}
              </div>

              <div className="acompte-detail">
                {depositDeclared
                  ? 'Paiement confirmé ✅'
                  : 'Obligatoire pour réserver votre panier'}
              </div>

            </div>
          )}

          {/* CONTACT */}
          <div className="recap-contact">

            <strong>
              Paiement via
            </strong>

            {specialRequest ? (
              <>
                Aucun paiement
                demandé pour le moment.
              </>
            ) : (
              <>
                MTN Mobile Money ·
                Moov Money · Carte
                bancaire
              </>
            )}

            <br />
            <br />

            <strong>
              Nous contacter
            </strong>

            <a
              href="https://wa.me/2290159871071"
              target="_blank"
              rel="noreferrer"
            >
              +229 0159871071
            </a>

            <br />

            Réponse sous 24h ·
            Livraison partout au
            Bénin et ailleurs.

          </div>

        </div>

        {/* =========================
            VALIDATION
            (placé après le récapitulatif, cf. grid-template-areas)
        ========================= */}

        {(cart.length > 0 ||
          specialRequest) && (
          <div className="order-validate-block">
            <button
              className={`btn btn-fill order-validate-btn ${
                !depositDeclared &&
                !specialRequest
                  ? 'btn-disabled'
                  : ''
              }`}
              style={{
                width: '100%',
                justifyContent:
                  'center',
                padding:
                  '1.1rem',
              }}
              onClick={
                validate
              }
              disabled={
                !depositDeclared &&
                !specialRequest
              }
            >
              <span>
                {specialRequest
                  ? 'Envoyer ma demande'
                  : 'Valider ma commande'}
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

            <p
              style={{
                fontSize:
                  '.75rem',
                color:
                  'var(--muted)',
                marginTop:
                  '.8rem',
                textAlign:
                  'center',
              }}
            >
              {specialRequest
                ? "Votre demande de création spéciale sera envoyée sur WhatsApp. Le prix sera défini après étude."
                : depositDeclared
                ? "Votre commande sera envoyée sur WhatsApp avec le détail de votre paiement."
                : "Réglez l'acompte pour activer la validation."}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}