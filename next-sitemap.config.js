/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.alphanom.in/',
  generateRobotsTxt: true, // Generates a robots.txt file alongside it
  generateIndexSitemap: false, // Set to true if you have over 50,000 URLs
}
