/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://alphanom.in',
  generateRobotsTxt: true, 
  generateIndexSitemap: false,
  
  // Add the routes you want to hide from Google here
  exclude: [
    '/auth/*',                 // Excludes all forgot-password and auth sub-routes
    '/employer/login',         // Excludes employer login
    '/employer/signup',        // Excludes employer signup
    '/recruiter/login',        // Excludes recruiter login
    '/recruiter/signup',       // Excludes recruiter signup
  ],

  // Optional: This ensures the robots.txt file blocks bots from crawling them too
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/auth/*',
          '*/login',
          '*/signup',
        ],
      },
    ],
  },
}
