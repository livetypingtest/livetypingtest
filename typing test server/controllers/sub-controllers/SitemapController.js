module.exports = (adminModel, DataModel, key) => {
    const route = require('express').Router();

    // Function to fetch dynamic routes
    async function fetchDynamicRoutesFromDatabase() {
        const blogs = await adminModel.find({});
        const data = blogs[0]?.blog;
        return data?.map((value) => value.permalink);
    }

    // Generate XML Sitemap
    async function generateSitemap() {
        const staticRoutes = [
            '/',
            '/about',
            '/contact',
            '/leaderboard',
            '/blog',
            '/dashboard',
            '/signout/isSignout',
            '/signup',
            '/privacy',
            '/term-condition',
            '/transparent',
            '/stats',
            '/matches/easy',
            '/matches/medium',
            '/matches/hard',
            '/signin',
            '/user',
        ]; // Your static routes

        const dynamicRoutes = await fetchDynamicRoutesFromDatabase();
        const baseUrl = 'https://livetypingtest.com';

        // Generate XML entries
        const staticUrls = staticRoutes
            .map((route) => `<url><loc>${baseUrl}${route}</loc></url>`)
            .join('\n');

        const dynamicUrls = dynamicRoutes
            ? dynamicRoutes
                  .map((route) => `<url><loc>${baseUrl}/blog/${route}</loc></url>`)
                  .join('\n')
            : '';

        return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticUrls}
    ${dynamicUrls}
</urlset>`;
    }

    // Serve Sitemap
    route.get('/', async (req, res) => {
        try {
            const sitemap = await generateSitemap();
            res.header('Content-Type', 'application/xml');
            res.send(sitemap);
        } catch (error) {
            console.error('Error generating sitemap:', error);
            res.status(500).send('Internal Server Error');
        }
    });

    return route;
};
