import { useNavigate } from 'react-router-dom';
import { useCanGoBack } from './useNavigationHistory';

/**
 * @param {string} fallbackPath - route de secours si l'utilisateur est arrivé
 *   directement sur la page (lien externe, Google, URL tapée à la main).
 */
export function useSmartBack(fallbackPath = '/') {
  const navigate = useNavigate();
  const canGoBack = useCanGoBack();

  return function goBack() {
    if (canGoBack) {
      navigate(-1);
    } else {
      navigate(fallbackPath, { replace: true });
    }
  };
}