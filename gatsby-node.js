// Writes public/sitemap.xml after each build, listing every page in src/data/seo.js that should be in
// search results. Google and Bing read it to find pages (see robots.txt).
const fs = require('fs')
const path = require('path')
const { SITE_URL, PAGES, NOINDEX } = require('./src/data/seo')

exports.onPostBuild = () => {
  const today = new Date().toISOString().slice(0, 10)
  const urls = Object.entries(PAGES)
    .filter(([p]) => !NOINDEX.includes(p) && fs.existsSync(path.join(__dirname, 'public', p, 'index.html')))
    .map(([p, page]) => {
      const lastmod = (page.article && page.article.date) || today
      return `  <url><loc>${SITE_URL}${p}</loc><lastmod>${lastmod}</lastmod><priority>${(page.priority || 0.5).toFixed(1)}</priority></url>`
    })
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
  fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), xml)
  console.log(`Sitemap written with ${urls.length} pages`)
}
