import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './PaymentProofModal.css';

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const ACCEPTED_EXT = ['.jpg', '.jpeg', '.png'];
const MAX_SIZE_MB = 8;

const emptyForm = {
  nomPrenom: '',
  numeroPaiement: '',
  montantEnvoye: '',
  datePaiement: '',
  heureApprox: '',
  reference: '',
};

/**
 * Modal de déclaration de preuve de paiement (acompte Mobile Money).
 *
 * Aucun backend n'est appelé ici : le fichier reste un objet File en mémoire.
 * Quand un backend sera branché, c'est ici (voir handleSubmit) qu'il faudra
 * envoyer `file` vers votre API d'upload et remplacer `previewUrl` par l'URL
 * distante retournée.
 */
export default function PaymentProofModal({
  isOpen,
  onClose,
  onConfirm,
  montantAttendu,
  defaultNom = '',
  defaultTel = '',
}) {
  const [form, setForm] = useState({ ...emptyForm, nomPrenom: defaultNom, numeroPaiement: defaultTel });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileError, setFileError] = useState('');
  const [touched, setTouched] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [closing, setClosing] = useState(false);
  const confirmedRef = useRef(false);
  const dialogRef = useRef(null);

  // Réinitialise le formulaire à chaque ouverture
  useEffect(() => {
    if (isOpen) {
      setForm({ ...emptyForm, nomPrenom: defaultNom, numeroPaiement: defaultTel, montantEnvoye: montantAttendu ? String(montantAttendu) : '' });
      setFile(null);
      setPreviewUrl(null);
      setFileError('');
      setTouched(false);
      confirmedRef.current = false;
      setClosing(false);
    }
  }, [isOpen, defaultNom, defaultTel, montantAttendu]);

  // Nettoyage de l'URL d'aperçu si le fichier change ou si le modal se ferme sans validation
  useEffect(() => {
    return () => {
      if (previewUrl && !confirmedRef.current) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Fermeture avec la touche Échap
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === 'Escape' && requestClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const requestClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      onClose();
    }, 180);
  }, [onClose]);

  const validateAndSetFile = (candidate) => {
    if (!candidate) return;
    const ext = candidate.name.slice(candidate.name.lastIndexOf('.')).toLowerCase();
    const typeOk = ACCEPTED_TYPES.includes(candidate.type) || ACCEPTED_EXT.includes(ext);
    if (!typeOk) {
      setFileError('Format non accepté. Utilisez une image JPG, JPEG ou PNG.');
      return;
    }
    if (candidate.size > MAX_SIZE_MB * 1024 * 1024) {
      setFileError(`Fichier trop volumineux (max ${MAX_SIZE_MB} Mo).`);
      return;
    }
    setFileError('');
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(candidate);
    setPreviewUrl(URL.createObjectURL(candidate));
  };

  const handleFileInput = (e) => validateAndSetFile(e.target.files?.[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    validateAndSetFile(e.dataTransfer.files?.[0]);
  };

  const removeFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
  };

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const montantSaisi = parseFloat(form.montantEnvoye);
  const montantAttenduNum = Number(montantAttendu) || 0;
  const montantCorrespond = montantAttenduNum <= 0 || montantSaisi === montantAttenduNum;

  const requiredOk =
    form.nomPrenom.trim() &&
    form.numeroPaiement.trim() &&
    form.montantEnvoye.toString().trim() &&
    form.datePaiement &&
    form.heureApprox;

  const isValid = Boolean(requiredOk && file && !fileError && montantCorrespond);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return; // bloque aussi si montantCorrespond est faux

    confirmedRef.current = true;

    // TODO(backend): envoyer `file` à votre API d'upload ici, puis remplacer
    // previewUrl par l'URL distante avant de stocker la preuve définitive.
    onConfirm({
      ...form,
      montantEnvoye: form.montantEnvoye.toString().trim(),
      fileName: file.name,
      fileSize: file.size,
      previewUrl,
      file,
      declaredAt: new Date().toISOString(),
    });
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`ppm-overlay ${closing ? 'ppm-closing' : ''}`}
      onMouseDown={(e) => e.target === e.currentTarget && requestClose()}
      role="presentation"
    >
      <div
        className={`ppm-dialog ${closing ? 'ppm-closing' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ppm-title"
        ref={dialogRef}
      >
        <button type="button" className="ppm-close" onClick={requestClose} aria-label="Fermer">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="ppm-header">
          <div className="ppm-eyebrow">Déclaration de paiement</div>
          <h2 id="ppm-title">Confirmez votre dépôt</h2>
          <p>Renseignez les détails du virement Mobile Money et joignez votre capture d'écran.</p>
        </div>

        <form className="ppm-form" onSubmit={handleSubmit} noValidate>
          <div className="ppm-row">
            <div className="ppm-field">
              <label htmlFor="ppm-nom">Nom et prénom *</label>
              <input id="ppm-nom" type="text" value={form.nomPrenom} onChange={setField('nomPrenom')} placeholder="Votre nom complet" />
              {touched && !form.nomPrenom.trim() && <span className="ppm-error">Champ requis</span>}
            </div>
            <div className="ppm-field">
              <label htmlFor="ppm-numero">Numéro ayant payé *</label>
              <input id="ppm-numero" type="tel" value={form.numeroPaiement} onChange={setField('numeroPaiement')} placeholder="+229 90 00 00 00" />
              {touched && !form.numeroPaiement.trim() && <span className="ppm-error">Champ requis</span>}
            </div>
          </div>

          <div className="ppm-row">
            <div className="ppm-field">
              <label htmlFor="ppm-montant">Montant envoyé (FCFA) *</label>
              <input id="ppm-montant" type="number" min="0" value={form.montantEnvoye} onChange={setField('montantEnvoye')} placeholder="Ex: 25000" />
              {touched && !form.montantEnvoye.toString().trim() && <span className="ppm-error">Champ requis</span>}
              {touched && form.montantEnvoye.toString().trim() && !montantCorrespond && (
                <span className="ppm-error">Le montant ne correspond pas à l'acompte demandé ({montantAttenduNum.toLocaleString()} FCFA)</span>
              )}
            </div>
            <div className="ppm-field">
              <label htmlFor="ppm-reference">Référence de transaction</label>
              <input id="ppm-reference" type="text" value={form.reference} onChange={setField('reference')} placeholder="Optionnel" />
            </div>
          </div>

          <div className="ppm-row">
            <div className="ppm-field">
              <label htmlFor="ppm-date">Date du paiement *</label>
              <input id="ppm-date" type="date" value={form.datePaiement} onChange={setField('datePaiement')} max={new Date().toISOString().slice(0, 10)} />
              {touched && !form.datePaiement && <span className="ppm-error">Champ requis</span>}
            </div>
            <div className="ppm-field">
              <label htmlFor="ppm-heure">Heure approximative *</label>
              <input id="ppm-heure" type="time" value={form.heureApprox} onChange={setField('heureApprox')} />
              {touched && !form.heureApprox && <span className="ppm-error">Champ requis</span>}
            </div>
          </div>

          <div className="ppm-field">
            <label>Capture d'écran de la preuve *</label>

            {!file ? (
              <label
                className={`ppm-dropzone ${dragActive ? 'ppm-drag-active' : ''} ${touched && !file ? 'ppm-invalid' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
              >
                <input type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png" onChange={handleFileInput} hidden />
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 16V4M12 4 7 9M12 4l5 5M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
                </svg>
                <span className="ppm-dropzone-title">Glissez votre capture ici</span>
                <span className="ppm-dropzone-sub">ou cliquez pour parcourir · JPG, JPEG, PNG</span>
              </label>
            ) : (
              <div className="ppm-preview">
                <img src={previewUrl} alt="Aperçu de la preuve de paiement" />
                <div className="ppm-preview-meta">
                  <span className="ppm-preview-name">{file.name}</span>
                  <span className="ppm-preview-size">{(file.size / 1024).toFixed(0)} Ko</span>
                </div>
                <button type="button" className="ppm-preview-remove" onClick={removeFile}>Remplacer</button>
              </div>
            )}
            {fileError && <span className="ppm-error">{fileError}</span>}
            {touched && !file && !fileError && <span className="ppm-error">Une capture d'écran est requise</span>}
          </div>

          <button type="submit" className={`ppm-submit ${isValid ? '' : 'ppm-submit-disabled'}`}>
            Valider ma déclaration de paiement
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}