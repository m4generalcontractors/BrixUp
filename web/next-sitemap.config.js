/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.brixups.com",
  generateRobotsTxt: false, // We maintain robots.txt manually
  exclude: [
    "/admin/*",
    "/api/*",
    "/login",
    "/dashboard",
    "/wallet",
    "/marketplace",
    "/builder",
    "/dealfinder",
    "/settings",
    "/verify",
    "/agreements",
  ],
  changefreq: "weekly",
  priority: 0.7,
};
