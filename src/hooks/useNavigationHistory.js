import { createContext, useContext, useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const STORAGE_KEY = 'nc_nav_depth';

const NavigationHistoryContext = createContext({ canGoBack: false });

export function NavigationHistoryProvider({ children }) {
  const location = useLocation();
  const navigationType = useNavigationType(); // 'PUSH' | 'POP' | 'REPLACE'
  const depthRef = useRef(getStoredDepth());
  const isFirstRender = useRef(true);

  function getStoredDepth() {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? parseInt(raw, 10) : 0;
  }

  function setDepth(value) {
    const safeValue = Math.max(0, value);
    depthRef.current = safeValue;
    sessionStorage.setItem(STORAGE_KEY, String(safeValue));
  }

  useEffect(() => {
    // Au tout premier montage de l'app : on ne touche pas au compteur,
    // il reflète déjà la session (ou 0 si nouvelle session/onglet).
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (navigationType === 'PUSH') {
      setDepth(depthRef.current + 1);
    } else if (navigationType === 'POP') {
      // L'utilisateur est revenu en arrière (bouton système ou navigate(-1))
      setDepth(depthRef.current - 1);
    }
    // REPLACE : on ne change pas la profondeur, la page courante est juste remplacée
  }, [location, navigationType]);

  const canGoBack = depthRef.current > 0;

  return (
    <NavigationHistoryContext.Provider value={{ canGoBack }}>
      {children}
    </NavigationHistoryContext.Provider>
  );
}

export function useCanGoBack() {
  return useContext(NavigationHistoryContext).canGoBack;
}