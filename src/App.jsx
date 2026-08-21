import { useEffect, useRef, useState } from 'react';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Toast from './components/Toast';

import Home from './pages/Home';
import About from './pages/About';
import Formations from './pages/Formations';
import Collection from './pages/Collection';
import Commander from './pages/Commander';
import Inscription from './pages/Inscription';

import useReveal from './hooks/useReveal';

export default function App() {
  const [page, setPage] = useState('accueil');
  const [formation, setFormation] = useState(null);
  const [cart, setCart] = useState([]);

  const [toast, setToast] = useState({
    message: '',
    show: false
  });

  const toastTimeout = useRef(null);

  // Profondeur de navigation interne : permet de savoir si un "vrai"
  // retour est possible, ou si on est sur la 1ère page vue (arrivée directe).
  const depthRef = useRef(0);

  useReveal([page]);

  // =========================
  // HISTORIQUE NAVIGATEUR (bouton Retour physique / Android)
  // =========================

  useEffect(() => {
    // Initialise l'entrée d'historique de base au montage de l'app
    window.history.replaceState({ page: 'accueil', depth: 0 }, '', '');

    const handlePopState = (event) => {
      const state = event.state;

      if (state && typeof state.depth === 'number') {
        depthRef.current = state.depth;
        setPage(state.page);
        setFormation(state.formation || null);
      } else {
        depthRef.current = 0;
        setPage('accueil');
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // =========================
  // NAVIGATION (vers l'avant)
  // =========================

  const goTo = (id, extraState = {}) => {
    setPage(id);

    depthRef.current += 1;
    window.history.pushState(
      { page: id, depth: depthRef.current, ...extraState },
      '',
      ''
    );

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Pour les boutons "Retour" des pages : vrai retour en arrière si possible,
  // sinon repli raisonnable (ex: arrivée directe depuis un lien externe).
  const goBack = (fallbackPage = 'accueil') => {
    if (depthRef.current > 0) {
      window.history.back();
    } else {
      goTo(fallbackPage);
    }
  };

  // =========================
  // INSCRIPTION FORMATION
  // =========================

  const onInscription = (title, niveau, duree, price) => {
    const formationData = { title, niveau, duree, price };
    setFormation(formationData);
    goTo('inscription', { formation: formationData });
  };

  // =========================
  // PANIER
  // =========================

  const addToCart = (item) => {
    setCart((prev) => {
      const existingItem = prev.find(
        (it) => it.id === item.id
      );

      if (existingItem) {
        return prev.map((it) =>
          it.id === item.id
            ? {
                ...it,
                quantity: (it.quantity || 1) + 1
              }
            : it
        );
      }

      return [
        ...prev,
        {
          ...item,
          quantity: item.quantity || 1
        }
      ];
    });
  };

  const updateCartItem = (id, patch) => {
    setCart((prev) =>
      prev.map((it) =>
        it.id === id
          ? {
              ...it,
              ...patch
            }
          : it
      )
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) =>
      prev.filter((it) => it.id !== id)
    );
  };

  // =========================
  // TOAST
  // =========================

  const showToast = (message) => {
    setToast({
      message,
      show: true
    });

    if (toastTimeout.current) {
      clearTimeout(toastTimeout.current);
    }

    toastTimeout.current = setTimeout(() => {
      setToast((t) => ({
        ...t,
        show: false
      }));
    }, 3500);
  };

  // =========================
  // AFFICHAGE
  // =========================

  return (
    <>
      <Loader />

      <Navbar
        page={page}
        goTo={goTo}
      />

      <Toast
        message={toast.message}
        show={toast.show}
      />

      {page === 'accueil' && (
        <Home
          goTo={goTo}
          addToCart={addToCart}
        />
      )}

      {page === 'apropos' && (
        <About
          goTo={goTo}
          goBack={goBack}
        />
      )}

      {page === 'formations' && (
        <Formations
          goTo={goTo}
          goBack={goBack}
          onInscription={onInscription}
        />
      )}

      {page === 'collection' && (
        <Collection
          goTo={goTo}
          goBack={goBack}
          showToast={showToast}
          addToCart={addToCart}
          cartCount={cart.length}
        />
      )}

      {page === 'commander' && (
        <Commander
          goTo={goTo}
          goBack={goBack}
          showToast={showToast}
          cart={cart}
          updateCartItem={updateCartItem}
          removeFromCart={removeFromCart}
        />
      )}

      {page === 'inscription' && (
        <Inscription
          goTo={goTo}
          goBack={goBack}
          formation={formation}
          showToast={showToast}
        />
      )}
    </>
  );
}