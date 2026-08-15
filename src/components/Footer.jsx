export function FooterFull({ goTo }) {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-brand-name">Nice <em>Création</em></div>
          <p>Une marque béninoise née d'une ambition : allier élégance, artisanat et authenticité dans chaque création faite main.</p>
          <div className="footer-socials">
            <a href="https://www.facebook.com/share/19QgBjfC1H/" className="social-btn" target="_blank" rel="noreferrer">fb</a>
            <a href="https://www.instagram.com/nice.creation1?igsh=Z3AxdHhsaHE4Mjdv" className="social-btn" target="_blank" rel="noreferrer">ig</a>
            <a href="https://www.tiktok.com/@nicecrochet0?_r=1&_t=ZS-97t2LsEUaTF" className="social-btn" target="_blank" rel="noreferrer">tk</a>
            <a href="https://wa.me//2290159871071" className="social-btn" target="_blank" rel="noreferrer">wa</a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Navigation</h4>
          <ul>
            <li><a href="#" onClick={(e) => { e.preventDefault(); goTo('accueil'); }}>Accueil</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); goTo('apropos'); }}>À propos</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); goTo('formations'); }}>Formations</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); goTo('collection'); }}>Collection</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); goTo('commander'); }}>Commander</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <ul>
            <li><a href="https://wa.me//2290159871071">WhatsApp</a></li>
            <li><a href="https://www.instagram.com/nice.creation1?igsh=Z3AxdHhsaHE4Mjdv">Instagram</a></li>
            <li><a href="#">Cotonou, Bénin</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2025 Nice Création. Tous droits réservés.</span>
        <span>Fait main avec ❤ au Bénin</span>
      </div>
    </footer>
  );
}

export function FooterSimple({ text }) {
  return (
    <footer>
      <div className="footer-bottom" style={{ maxWidth: 'none', padding: '0 clamp(1.5rem,6vw,5rem)' }}>
        <span>© 2025 Nice Création. Tous droits réservés.</span>
        <span>{text}</span>
      </div>
    </footer>
  );
}
