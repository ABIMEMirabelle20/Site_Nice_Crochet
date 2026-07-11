import { useState } from 'react';
import BackButton from '../components/BackButton';
import { WHATSAPP_NUMBER } from '../data';

export default function Inscription({ goTo, formation, showToast }) {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [tel, setTel] = useState('');
  const [wa, setWa] = useState('');
  const [ville, setVille] = useState('');
  const [niveau, setNiveau] = useState('');
  const [mode, setMode] = useState('');
  const [dispo, setDispo] = useState('');
  const [notes, setNotes] = useState('');

  if (!formation) {
    return (
      <div className="page active" id="page-inscription">
        <BackButton label="Retour aux formations" onClick={() => goTo('formations')} />
        <div style={{ padding: '4rem clamp(1.5rem,6vw,5rem)' }}>
          <p>Veuillez d'abord sélectionner une formation.</p>
        </div>
      </div>
    );
  }

  const prixTotal = formation.price;
  const acompte = Math.round(prixTotal * 0.5);

  const submit = () => {
    if (!prenom.trim() || !nom.trim() || !tel.trim()) {
      showToast('Veuillez remplir les champs obligatoires (*)');
      return;
    }
    const msg = `Bonjour Nice Crochet ! Je souhaite m'inscrire à une formation 🎓

— Formation : ${formation.title}
— Nom : ${prenom} ${nom}
— Téléphone : ${tel}
— WhatsApp : ${wa || tel}
— Ville : ${ville || 'non précisé'}
— Mon niveau : ${niveau || 'non précisé'}
— Mode souhaité : ${mode || 'non précisé'}
— Disponibilités : ${dispo || 'flexible'}
— Notes : ${notes || 'aucune'}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="page active" id="page-inscription">
      <div className="inscr-hero">
        <div className="inscr-hero-inner">
          <div className="section-label">Formulaire d'inscription</div>
          <h1>S'inscrire à<br /><em>{formation.title}</em></h1>
          <p>Remplissez le formulaire — nous vous confirmons votre place sous 24h</p>
        </div>
      </div>

      <BackButton label="Retour aux formations" onClick={() => goTo('formations')} />

      <div className="inscr-resume">
        <div className="inscr-resume-card"><div className="rc-icon">📚</div><div><div className="rc-label">Formation</div><div className="rc-val">{formation.title}</div></div></div>
        <div className="inscr-resume-card"><div className="rc-icon">🎯</div><div><div className="rc-label">Niveau</div><div className="rc-val">{formation.niveau}</div></div></div>
        <div className="inscr-resume-card"><div className="rc-icon">⏱</div><div><div className="rc-label">Durée</div><div className="rc-val">{formation.duree}</div></div></div>
        <div className="inscr-resume-card"><div className="rc-icon">💰</div><div><div className="rc-label">Tarif</div><div className="rc-val">{prixTotal.toLocaleString()} FCFA</div></div></div>
      </div>

      <div className="inscr-body">
        <div className="inscr-form-card">
          <h2>Vos informations personnelles</h2>
          <div className="form-row">
            <div className="form-group"><label>Prénom *</label><input type="text" placeholder="Votre prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} /></div>
            <div className="form-group"><label>Nom *</label><input type="text" placeholder="Votre nom" value={nom} onChange={(e) => setNom(e.target.value)} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Téléphone *</label><input type="tel" placeholder="+229 90 00 00 00" value={tel} onChange={(e) => setTel(e.target.value)} /></div>
            <div className="form-group"><label>WhatsApp</label><input type="tel" placeholder="si différent" value={wa} onChange={(e) => setWa(e.target.value)} /></div>
          </div>
          <div className="form-group"><label>Quartier / Ville *</label><input type="text" placeholder="Ex: Cotonou, Calavi, Porto-Novo..." value={ville} onChange={(e) => setVille(e.target.value)} /></div>

          <h2 style={{ marginTop: '2rem' }}>Votre niveau & disponibilité</h2>
          <div className="form-group">
            <label>Votre niveau actuel en crochet</label>
            <div className="radio-group">
              {['Débutant absolu — je n\'ai jamais fait de crochet', 'J\'ai quelques bases, je veux progresser', 'Intermédiaire — je maîtrise les points de base', 'Avancé — je cherche à me perfectionner'].map((opt) => (
                <label className="radio-opt" key={opt}>
                  <input type="radio" name="niveau" checked={niveau === opt} onChange={() => setNiveau(opt)} /> {opt}
                </label>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Mode de suivi souhaité</label>
            <div className="radio-group">
              {['En présentiel à Cotonou', 'En ligne (WhatsApp / vidéo)', 'Les deux selon les semaines'].map((opt) => (
                <label className="radio-opt" key={opt}>
                  <input type="radio" name="mode" checked={mode === opt} onChange={() => setMode(opt)} /> {opt}
                </label>
              ))}
            </div>
          </div>
          <div className="form-group"><label>Disponibilités préférées</label><input type="text" placeholder="Ex: weekends, soir en semaine, matin..." value={dispo} onChange={(e) => setDispo(e.target.value)} /></div>
          <div className="form-group"><label>Questions ou précisions</label><textarea placeholder="Tout ce que vous souhaitez nous faire savoir..." value={notes} onChange={(e) => setNotes(e.target.value)}></textarea></div>

          <button className="btn btn-fill" style={{ width: '100%', justifyContent: 'center', padding: '1.1rem', marginTop: '.5rem' }} onClick={submit}>
            <span>Envoyer mon inscription par WhatsApp</span>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
          <p style={{ fontSize: '.75rem', color: 'var(--muted)', marginTop: '.8rem', textAlign: 'center' }}>Votre inscription sera envoyée directement sur notre WhatsApp. Nous vous confirmons sous 24h.</p>
        </div>

        <div className="inscr-sidebar">
          <div className="sidebar-card">
            <h3>Récapitulatif</h3>
            <div className="sidebar-recap">
              <div className="sidebar-recap-row"><span>Formation</span><span>{formation.title}</span></div>
              <div className="sidebar-recap-row"><span>Durée</span><span>{formation.duree}</span></div>
              <div className="sidebar-recap-row total"><span>Tarif total</span><span>{prixTotal.toLocaleString()} FCFA</span></div>
            </div>
            <div className="acompte-box">
              <div className="acompte-box-label">Acompte à verser</div>
              <div className="acompte-amount">{acompte.toLocaleString()} FCFA</div>
              <div className="acompte-detail">50% du tarif dû avant le début de la formation</div>
            </div>
            <div className="payment-methods">
              <span className="pm-badge">MTN Mobile Money</span>
              <span className="pm-badge">Moov Money</span>
              <span className="pm-badge">Espèces</span>
            </div>
          </div>

          <div className="sidebar-card">
            <h3>Comment ça se passe</h3>
            <div className="steps-inscr">
              <div className="step-inscr"><div className="step-inscr-num">1</div><div className="step-inscr-text"><strong>Vous envoyez ce formulaire</strong>Via WhatsApp directement</div></div>
              <div className="step-inscr"><div className="step-inscr-num">2</div><div className="step-inscr-text"><strong>Confirmation sous 24h</strong>Nous validons votre inscription</div></div>
              <div className="step-inscr"><div className="step-inscr-num">3</div><div className="step-inscr-text"><strong>Versement de l'acompte</strong>50% pour réserver votre place</div></div>
              <div className="step-inscr"><div className="step-inscr-num">4</div><div className="step-inscr-text"><strong>La formation commence !</strong>On vous envoie le planning</div></div>
            </div>
          </div>

          <div className="sidebar-card">
            <h3>Une question ?</h3>
            <div className="recap-contact">
              <strong>Nous contacter</strong>
              Écrivez-nous directement sur <a href="https://wa.me//22990614396" target="_blank" rel="noreferrer">WhatsApp</a> ou sur Instagram <a href="https://www.instagram.com/nice.creation1?igsh=Z3AxdHhsaHE4Mjdv" target="_blank" rel="noreferrer">@NiceCrochet</a>.<br /><br />
              Nous répondons 7j/7 entre 8h et 20h.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
