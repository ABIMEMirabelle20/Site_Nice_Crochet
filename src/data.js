export const collectionItems = [
  { name:'Robe Bohème', desc:'Style léger et aérien, parfait pour les journées ensoleillées.', price:'15 000 FCFA', cat:'robes', emoji:'🌿', badge:'Exclusif', bc:'var(--chocolate-light)' },
  { name:'Top Évasé Pastel', desc:"Disponible en plusieurs couleurs pastel, parfait pour l'été.", price:'8 000 FCFA', cat:'tops', emoji:'✦', badge:'Best-seller', bc:'var(--terracotta)' },
  { name:'Ensemble 2 Pièces', desc:'Tenue élégante et confortable pour toute occasion.', price:'20 000 FCFA', cat:'ensembles', emoji:'🎀', badge:'Édition limitée', bc:'var(--chocolate)' },
  { name:'Robe Midi Raffinée', desc:'Longueur midi élégante, silhouette affinée et dentelle de mailles.', price:'18 000 FCFA', cat:'robes', emoji:'🌸', badge:'Nouveau', bc:'var(--terracotta)' },
  { name:'Top Brassière', desc:'Crop top brassière pour un look moderne et estival.', price:'6 000 FCFA', cat:'tops', emoji:'💛', badge:'', bc:'' },
  { name:'Veste Longue', desc:'Veste longue en crochet ouvert, parfaite sur une robe ou un jean.', price:'14 000 FCFA', cat:'ensembles', emoji:'🤎', badge:'Tendance', bc:'var(--chocolate-light)' },
  { name:'Robe à Frange', desc:'Franges dansantes pour une allure bohème chic.', price:'17 000 FCFA', cat:'robes', emoji:'✨', badge:'', bc:'' },
  { name:'Débardeur Filet', desc:'Débardeur léger en crochet filet, tendance et respirant.', price:'7 000 FCFA', cat:'tops', emoji:'🌾', badge:'', bc:'' },
  { name:'Ensemble Short', desc:'Ensemble short coordonné pour une tenue sport-chic.', price:'16 000 FCFA', cat:'ensembles', emoji:'🎯', badge:'Populaire', bc:'var(--terracotta)' },
];

export const formations = [
  {
    key:'niveau1', level:'Niveau 1 — Débutant', title:'Initiation au Crochet Moderne', price:5000,
    desc:"Apprenez les bases du crochet avec style : techniques simples, matériels essentiels, et premiers modèles élégants pour bien débuter en toute confiance.",
    duree:'2 semaines', pubLabel:'Public', pubVal:'Absolus débutants',
    includes:['Supports pédagogiques','Matériel de démarrage','Suivi personnalisé'],
    niveau:'Débutant', cls:'fc-level1',
  },
  {
    key:'niveau2', level:'Niveau 2 — Intermédiaire', title:'Création de Vêtements en Crochet', price:12000,
    desc:'Réalisez vos propres vêtements : hauts, robes, ensembles modernes. Techniques de couture et finitions professionnelles incluses pour un rendu impeccable.',
    duree:'4 semaines', pubLabel:'Prérequis', pubVal:'Niveau initiation acquis',
    includes:['Patrons & modèles exclusifs','Techniques de finition','Certificat de niveau'],
    niveau:'Intermédiaire', cls:'fc-level2',
  },
  {
    key:'niveau3', level:'Niveau 3 — Avancé', title:'Techniques Avancées & Design Personnalisé', price:18000,
    desc:'Maîtrisez le crochet professionnel : création sur mesure, combinaisons de points complexes, design tendance et finitions haute couture pour vous lancer.',
    duree:'6 semaines', pubLabel:'Prérequis', pubVal:'Niveau intermédiaire acquis',
    includes:['Accès à tous les patrons','Coaching individuel','Diplôme Nice Crochet'],
    niveau:'Avancé', cls:'fc-level3',
  },
];

export const pieces = [
  { name:'Robe Bohème', price:15000, emoji:'🌿' },
  { name:'Top Évasé', price:8000, emoji:'✦' },
  { name:'Ensemble 2 pièces', price:20000, emoji:'🎀' },
  { name:'Robe Midi', price:18000, emoji:'🌸' },
  { name:'Top Brassière', price:6000, emoji:'💛' },
  { name:'Sur mesure', price:0, emoji:'🎨' },
];

export const swatches = [
  { name:'Ivoire', color:'#F5F0E8', border:true },
  { name:'Khaki', color:'#C8B99A' },
  { name:'Camel', color:'#C19A6B' },
  { name:'Cocoa', color:'#6F4E37' },
  { name:'Noir', color:'#1a1a1a' },
  { name:'Blanc', color:'#fff', border:true },
  { name:'Rose', color:'#E8B4A0' },
  { name:'Autre', color:'linear-gradient(135deg,#ff6b6b,#4ecdc4,#95e1d3)' },
];

export const WHATSAPP_NUMBER = '22990000000';
