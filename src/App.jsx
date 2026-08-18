import { useRef, useState } from 'react';
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

  useReveal([page]);

  // =========================
  // NAVIGATION
  // =========================

  const goTo = (id) => {
    setPage(id);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // =========================
  // INSCRIPTION FORMATION
  // =========================

  const onInscription = (title, niveau, duree, price) => {
    setFormation({
      title,
      niveau,
      duree,
      price
    });

    goTo('inscription');
  };

  // =========================
  // PANIER
  // =========================

  const addToCart = (item) => {
    setCart((prev) => {
      const existingItem = prev.find(
        (it) => it.id === item.id
      );

      // Si le produit existe déjà :
      // on augmente simplement la quantité
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

      // Sinon on ajoute le produit
      return [
        ...prev,
        {
          ...item,
          quantity: item.quantity || 1
        }
      ];
    });
  };

  // Modifier un produit du panier
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

  // Supprimer un produit du panier
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

      {/* ACCUEIL */}
      {page === 'accueil' && (
        <Home
          goTo={goTo}
          addToCart={addToCart}
        />
      )}

      {/* À PROPOS */}
      {page === 'apropos' && (
        <About
          goTo={goTo}
        />
      )}

      {/* FORMATIONS */}
      {page === 'formations' && (
        <Formations
          goTo={goTo}
          onInscription={onInscription}
        />
      )}

      {/* COLLECTION */}
      {page === 'collection' && (
        <Collection
          goTo={goTo}
          showToast={showToast}
          addToCart={addToCart}
          cartCount={cart.length}
        />
      )}

      {/* COMMANDER / PANIER */}
      {page === 'commander' && (
        <Commander
          goTo={goTo}
          showToast={showToast}
          cart={cart}
          updateCartItem={updateCartItem}
          removeFromCart={removeFromCart}
        />
      )}

      {/* INSCRIPTION */}
      {page === 'inscription' && (
        <Inscription
          goTo={goTo}
          formation={formation}
          showToast={showToast}
        />
      )}
    </>
  );
}