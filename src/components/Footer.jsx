import { useState } from 'react';

// Icônes inline (traits fins, cohérentes avec le reste du site) —
// pas de dépendance externe, juste du SVG.
const IconFacebook = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.5 21v-8.5H16l.4-3H13.5V7.5c0-.87.24-1.46 1.5-1.46H16.5V3.35C16.06 3.3 15.05 3.2 13.9 3.2c-2.4 0-4.05 1.46-4.05 4.15V9.5H7.4v3h2.45V21h3.65Z" />
  </svg>
);

const IconInstagram = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const IconTiktok = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.8 3h-2.6v12.2a2.7 2.7 0 1 1-2.2-2.66v-2.62a5.3 5.3 0 1 0 4.8 5.28V9.1c1 .7 2.2 1.1 3.4 1.1V7.6c-1.86 0-3.4-1.28-3.4-2.9V3Z" />
  </svg>
);

const IconWhatsapp = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.9a9.1 9.1 0 0 0-7.85 13.7L3 21.1l4.6-1.2A9.1 9.1 0 1 0 12 2.9Zm0 1.8a7.3 7.3 0 0 1 6.32 10.98l-.2.34.9 3.28-3.36-.88-.33.2A7.3 7.3 0 1 1 12 4.7Zm-2.7 3.5c-.18 0-.47.07-.72.34-.24.27-.94.9-.94 2.2 0 1.3.96 2.55 1.1 2.72.13.18 1.87 2.98 4.6 4.06 2.28.9 2.74.72 3.24.68.5-.05 1.6-.65 1.83-1.28.22-.63.22-1.17.15-1.28-.06-.1-.24-.17-.5-.3-.26-.13-1.6-.79-1.85-.88-.24-.1-.42-.13-.6.13-.17.27-.68.88-.83 1.06-.15.18-.3.2-.57.07-.26-.13-1.1-.4-2.1-1.3-.78-.68-1.3-1.53-1.46-1.8-.15-.26-.02-.4.11-.54.12-.12.27-.3.4-.46.13-.15.18-.26.27-.44.09-.17.05-.33-.02-.46-.07-.13-.6-1.46-.83-2-.22-.53-.44-.46-.6-.47h-.5Z" />
  </svg>
);

// URL d'action fournie par Brevo (Contacts → Formulaires → code
// d'intégration HTML). À ne changer que si vous recréez le formulaire
// côté Brevo — l'URL contient l'identifiant unique du formulaire.
const BREVO_FORM_ACTION = "https://cb3c2537.sibforms.com/serve/MUIFAILc5YDzuiJXax9Xp1WaFf8Z58cAiowu93TE8ngAjkV-FhiT0tUwzQcIR7K2bwuaVo3TCI_kD_yj_8FEaELooYkczV6DBa0nGp43wQ2mPe-ml242k3iLa9RwBgszIreDS5C4mtGEDz-3PWVX6EO6PN8kkTyx0JH5rfskJ8wP9HQuXh5ODceHEitHpvemzxP3eJaqvhtPEXXGOA==";

export function FooterFull({ goTo }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Le formulaire envoie un vrai POST vers Brevo (action + method ci-
  // dessous), ce qui ajoute réellement le contact à la liste. Pour
  // éviter de faire quitter le site (comportement par défaut d'un
  // POST classique, qui ouvrirait la page de confirmation de Brevo),
  // la soumission est redirigée dans un iframe invisible via
  // target="newsletter-frame" (voir plus bas dans le JSX).
  // On ne peut pas lire la réponse de cet iframe (domaine différent),
  // donc on affiche notre propre message de remerciement juste après
  // l'envoi plutôt que d'attendre une confirmation de Brevo — la
  // validation du format email par le navigateur (type="email" +
  // required) suffit à filtrer les saisies invalides avant l'envoi.
  const handleNewsletterSubmit = () => {
    setTimeout(() => {
      setSubscribed(true);
      setEmail('');
    }, 400);
  };

  return (
    <footer>
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-brand-name">Nice <em>Création</em></div>
          <p>L'art du fait main, réinventé.</p>
          <div className="footer-socials">
            <a href="https://www.facebook.com/share/19QgBjfC1H/" className="social-btn" aria-label="Facebook" target="_blank" rel="noreferrer"><IconFacebook /></a>
            <a href="https://www.instagram.com/nice.creation1?igsh=Z3AxdHhsaHE4Mjdv" className="social-btn" aria-label="Instagram" target="_blank" rel="noreferrer"><IconInstagram /></a>
            <a href="https://www.tiktok.com/@nicecrochet0?_r=1&_t=ZS-97t2LsEUaTF" className="social-btn" aria-label="TikTok" target="_blank" rel="noreferrer"><IconTiktok /></a>
            <a href="https://wa.me//2290159871071" className="social-btn" aria-label="WhatsApp" target="_blank" rel="noreferrer"><IconWhatsapp /></a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Collection</h4>
          <ul>
            <li><a href="#" onClick={(e) => { e.preventDefault(); goTo('collection'); }}>Collection</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); goTo('collection'); }}>Nouveautés</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); goTo('collection'); }}>Best-sellers</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Maison</h4>
          <ul>
            <li><a href="#" onClick={(e) => { e.preventDefault(); goTo('apropos'); }}>À propos</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); goTo('apropos'); }}>L'atelier</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); goTo('histoire'); }}>Notre histoire</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Services</h4>
          <ul>
            <li><a href="#" onClick={(e) => { e.preventDefault(); goTo('commander'); }}>Sur mesure</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); goTo('formations'); }}>Formations</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); goTo('commander'); }}>Commande & livraison</a></li>
          </ul>
        </div>

        <div className="footer-newsletter">
          <h4>Restez informée</h4>
          {subscribed ? (
            <p className="footer-newsletter-thanks">Merci, à très vite ! 🧶</p>
          ) : (
            <form
              action={BREVO_FORM_ACTION}
              method="POST"
              target="newsletter-frame"
              onSubmit={handleNewsletterSubmit}
            >
              <input
                type="email"
                name="EMAIL"
                placeholder="Votre e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">→</button>

              {/* Champs requis par Brevo — à garder tels quels :
                  email_address_check est un piège à robots (doit
                  rester vide et invisible), locale force la langue
                  des emails de confirmation. */}
              <input
                type="text"
                name="email_address_check"
                defaultValue=""
                style={{ display: 'none' }}
                tabIndex="-1"
                autoComplete="off"
              />
              <input type="hidden" name="locale" value="fr" />
            </form>
          )}

          {/* Cible invisible du formulaire : reçoit la réponse de
              Brevo (page de confirmation) sans faire quitter le site. */}
          <iframe
            name="newsletter-frame"
            title="Confirmation inscription newsletter"
            style={{ display: 'none' }}
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Nice Création. Tous droits réservés.</span>
        <span>Fait main avec ❤ au Bénin</span>
      </div>
    </footer>
  );
}

export function FooterSimple({ text }) {
  return (
    <footer>
      <div className="footer-bottom" style={{ maxWidth: 'none', padding: '0 clamp(1.5rem,6vw,5rem)' }}>
        <span>© 2026 Nice Création. Tous droits réservés.</span>
        <span>{text}</span>
      </div>
    </footer>
  );
}