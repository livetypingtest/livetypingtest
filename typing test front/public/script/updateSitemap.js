// scripts/updateSitemap.js

const fs = require('fs');
const path = require('path');

// Path to the sitemap.xml file in the public folder
const sitemapPath = path.join(__dirname, '../sitemap.xml');

// Function to update sitemap.xml with dynamic URLs
function updateSitemap(dynamicUrls) {
  // Read the existing sitemap.xml
  fs.readFile(sitemapPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading sitemap.xml:', err);
      return;
    }

    // Loop through dynamic URLs and append them to the sitemap
    let updatedSitemap = data;

    dynamicUrls.forEach((url) => {
      const urlEntry = `
        <url>
          <loc>${url}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <priority>0.8</priority>
        </url>
      `;
      updatedSitemap = updatedSitemap.replace('</urlset>', `${urlEntry}</urlset>`);
    });

    // Write the updated sitemap.xml
    fs.writeFile(sitemapPath, updatedSitemap, 'utf8', (err) => {
      if (err) {
        console.error('Error writing sitemap.xml:', err);
      } else {
        console.log('Sitemap updated successfully.');
      }
    });
  });
}

export default updateSitemap
