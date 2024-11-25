// utils/MetaUpdater.js
const MetaUpdater = {
    /**
     * Update the page's title and favicon dynamically.
     * @param {string} title - The title to set for the page.
     * @param {string} [favicon] - (Optional) The path to the favicon to set.
     */
    updateMeta: (title, favicon) => {
      // Set the page title
      if (title) {
        document.title = title;
      }
  
      // Set the favicon if provided
      if (favicon) {
        const existingFavicon = document.querySelector("link[rel~='icon']");
        if (existingFavicon) {
          existingFavicon.href = favicon;
        } else {
          const newLink = document.createElement("link");
          newLink.rel = "icon";
          newLink.href = favicon;
          document.head.appendChild(newLink);
        }
      }
    },
  };
  
  export default MetaUpdater;
  