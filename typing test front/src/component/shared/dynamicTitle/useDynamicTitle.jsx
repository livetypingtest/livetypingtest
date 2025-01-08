import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useDynamicTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const updateTitleAndFavicon = () => {
      let title = "Live Typing Test"; // Default title
      let faviconPath = "/assets/images/favicon.png"; // Default favicon

      // Update the page title
      document.title = title;

      // Update the favicon
      const faviconElement = document.querySelector("link[rel~='icon']");
      if (faviconElement) {
        faviconElement.href = faviconPath;
      } else {
        const newFavicon = document.createElement('link');
        newFavicon.rel = 'icon';
        newFavicon.href = faviconPath;
        document.head.appendChild(newFavicon);
      }
    };

    updateTitleAndFavicon();
  }, [location.pathname]); // Re-run whenever the route changes
};

export default useDynamicTitle;
