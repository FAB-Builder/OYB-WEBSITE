/** @type {import('next-sitemap').IConfig} */
const privatePaths = ['/auth/*', '/*/auth/*', '/workspaces', '/workspaces/*', '/tools', '/tools/*', '/_not-found', '/404'];

module.exports = {
  siteUrl: 'https://oyb.app',
  generateRobotsTxt: true,
  outDir: 'out', // Points next-sitemap directly to your static export folder
  exclude: privatePaths,
  transform: async (config, path) => {
    const isHome = path === '/' || path === '/en' || path === '/sv';
    // Root duplicates /en, which is the canonical English homepage
    if (path === '/') return null;
    return {
      loc: path,
      changefreq: isHome ? 'weekly' : config.changefreq,
      priority: isHome ? 1.0 : config.priority,
      lastmod: new Date().toISOString(),
      alternateRefs: isHome
        ? [
            { href: 'https://oyb.app/en', hreflang: 'en', hrefIsAbsolute: true },
            { href: 'https://oyb.app/sv', hreflang: 'sv', hrefIsAbsolute: true },
            { href: 'https://oyb.app/en', hreflang: 'x-default', hrefIsAbsolute: true },
          ]
        : [],
    };
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/auth/', '/en/auth/', '/sv/auth/', '/workspaces', '/tools'],
      },
    ],
  },
};
