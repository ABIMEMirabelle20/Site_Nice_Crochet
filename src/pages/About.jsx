import BackButton from '../components/BackButton';
import { FooterSimple } from '../components/Footer';

export default function About({ goTo }) {
  return (
    <div className="page active" id="page-apropos">
      <div className="about-hero">
        <div className="about-hero-content">
          <div className="section-label">Notre histoire</div>
          <h1>À propos de<br /><em>Nice Crochet</em></h1>
        </div>
      </div>

      <BackButton label="Retour à l'accueil" onClick={() => goTo('accueil')} />

      <div className="about-body">
        <div className="about-visual reveal-left">
          <div className="about-visual-frame">
            <div className="about-visual-pattern"></div>
            <div className="about-visual-deco">🧶</div>
            <div className="about-visual-accent"></div>
          </div>
          <div className="about-visual-label">Artisanat & passion</div>
        </div>

        <div className="about-text reveal-right">
          <div className="section-label">Qui sommes-nous</div>
          <h2>Une marque née<br />d'une <em>ambition</em></h2>
          <div className="section-divider"></div>
          <p><strong>Nice Crochet</strong> est une marque béninoise née d'une ambition : celle de devenir indépendante et d'apprendre un métier issu du savoir-faire. Et quoi de mieux que les habits tricotés pour incarner cet idéal ?</p>
          <p>Chaque pièce faite main a une âme, une histoire, un amour unique. Mais derrière ces œuvres se cachent des heures de travail, des nuits sans sommeil — mais surtout du raffinement, de la précision et de la justesse.</p>
          <p>Nous tissons avec soin des créations en crochet selon vos choix et désirs, sans oublier d'y ajouter une touche de raffinement moderne. Rejoignez-nous dans ce voyage de créativité et d'authenticité. 🧶</p>

          <div className="timeline">
            <div className="tl-item"><div className="tl-dot">✦</div><div className="tl-content"><strong>Les débuts</strong><p>Premiers points, premières créations — une passion qui prend forme.</p></div></div>
            <div className="tl-item"><div className="tl-dot">✦</div><div className="tl-content"><strong>Premières clientes</strong><p>Le bouche-à-oreille fait son œuvre. La qualité parle d'elle-même.</p></div></div>
            <div className="tl-item"><div className="tl-dot">✦</div><div className="tl-content"><strong>Nice Crochet aujourd'hui</strong><p>Une marque reconnue, des formations, une communauté qui grandit.</p></div></div>
          </div>

          <div className="about-values">
            <div className="about-value"><div className="about-value-icon">✦</div><h4>Passion</h4><p>Chaque maille est posée avec amour</p></div>
            <div className="about-value"><div className="about-value-icon">🎯</div><h4>Précision</h4><p>Finitions impeccables, toujours</p></div>
            <div className="about-value"><div className="about-value-icon">🌿</div><h4>Durabilité</h4><p>Matières de qualité, production raisonnée</p></div>
            <div className="about-value"><div className="about-value-icon">💎</div><h4>Unicité</h4><p>Séries limitées, pièces exclusives</p></div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-fill" onClick={() => goTo('collection')}><span>Voir nos créations</span></button>
            <button className="btn" onClick={() => goTo('formations')}><span>Nos formations</span></button>
          </div>
        </div>
      </div>

      <FooterSimple text="Fait main avec ❤ au Bénin" />
    </div>
  );
}
