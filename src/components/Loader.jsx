import { useEffect, useState } from 'react';

export default function Loader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div id="loader" className={hidden ? 'hidden' : ''}>
      <div className="loader-brand">Nice Création</div>
      <div className="loader-bar"></div>
    </div>
  );
}
