import BackButton from '../components/BackButton';
import { FooterSimple } from '../components/Footer';
import { formations } from '../data';

export default function Formations({ goTo, goBack, onInscription }) {
  return (
    <div className="page active" id="page-formations">
      <div className="formation-hero">
        <div className="section-label">Apprenez le crochet</div>
        <h1>Nos <em>Formations</em></h1>
        <p>Du débutant au niveau avancé — progressez à votre rythme, à Cotonou</p>
      </div>

      <BackButton label="Retour à l'accueil" onClick={() => goBack('accueil')} style={{ background: 'var(--cream)' }} />

      <div className="formations-container">
        <div className="formations-grid-new">
          {formations.map((f) => (
            <div className={`formation-card-new ${f.cls} reveal`} key={f.key}>
              <div className="formation-card-header">
                <div className="formation-level-tag">{f.level}</div>
                <h3>{f.title}</h3>
                <div className="formation-big-price"><sup>FCFA</sup>{f.price.toLocaleString()}</div>
              </div>
              <div className="formation-card-body">
                <p className="formation-desc">{f.desc}</p>
                <div className="formation-details">
                  <div className="fd-row"><div className="fd-icon">⏱</div><span className="fd-label">Durée</span><span className="fd-val">{f.duree}</span></div>
                  <div className="fd-row"><div className="fd-icon">👤</div><span className="fd-label">{f.pubLabel}</span><span className="fd-val">{f.pubVal}</span></div>
                  <div className="fd-row"><div className="fd-icon">📍</div><span className="fd-label">Lieu</span><span className="fd-val">Cotonou / En ligne</span></div>
                </div>
              </div>
              <div className="formation-includes">
                <strong>Inclus dans la formation</strong>
                <ul>
                  {f.includes.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div className="formation-card-footer">
                <button
                  className="btn btn-fill btn-inscr"
                  onClick={() => onInscription(f.title, f.niveau, f.duree, f.price)}
                >
                  <span>S'inscrire à cette formation</span>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <FooterSimple text="Formations disponibles à Cotonou et en ligne" />
    </div>
  );
}