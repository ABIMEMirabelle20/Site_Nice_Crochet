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
  const [toast, setToast] = useState({ message: '', show: false });
  const toastTimeout = useRef(null);

  useReveal([page]);

  const goTo = (id) => {
    setPage(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onInscription = (title, niveau, duree, price) => {
    setFormation({ title, niveau, duree, price });
    goTo('inscription');
  };

  const showToast = (message) => {
    setToast({ message, show: true });
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 3500);
  };

  return (
    <>
      <Loader />
      <Navbar page={page} goTo={goTo} />
      <Toast message={toast.message} show={toast.show} />

      {page === 'accueil' && <Home goTo={goTo} />}
      {page === 'apropos' && <About goTo={goTo} />}
      {page === 'formations' && <Formations goTo={goTo} onInscription={onInscription} />}
      {page === 'collection' && <Collection goTo={goTo} />}
      {page === 'commander' && <Commander goTo={goTo} showToast={showToast} />}
      {page === 'inscription' && <Inscription goTo={goTo} formation={formation} showToast={showToast} />}
    </>
  );
}
