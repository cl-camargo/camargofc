import { chromium } from 'playwright';
import lighthouse from 'lighthouse';
import fs from 'node:fs/promises';
import path from 'node:path';

const base = 'https://camargofc.com.br';
const pages = ['/', '/noticias.html', '/agenda.html', '/elenco.html', '/estatisticas.html', '/galeria.html', '/historia.html', '/patrocinadores.html'];
const widths = [360, 390, 430, 768];
const dir = 'auditoria-output';
await fs.mkdir(dir, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--remote-debugging-port=9222'] });
const summary = { date: new Date().toISOString(), base, visual: [], lighthouse: [] };
try {
  for (const pagePath of pages) {
    for (const width of widths) {
      const page = await browser.newPage({ viewport: { width, height: 800 }, deviceScaleFactor: 1, isMobile: width < 768, hasTouch: width < 768 });
      const failures = [];
      page.on('pageerror', e => failures.push(e.message));
      try {
        const response = await page.goto(base + pagePath, { waitUntil: 'domcontentloaded', timeout: 45000 });
        await page.waitForTimeout(1200);
        const info = await page.evaluate(() => ({
          documentWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth,
          menuPresent: Boolean(document.querySelector('#site-menu nav')),
          missingImages: [...document.images].filter(i => i.complete && i.naturalWidth === 0 && i.getAttribute('src')).map(i => i.getAttribute('src')).slice(0, 20)
        }));
        const name = pagePath === '/' ? 'inicio' : pagePath.replace(/^\\/|\\.html$/g, '').replace(/[^a-z0-9-]/gi, '-');
        await page.screenshot({ path: path.join(dir, name + '-' + width + '.png'), fullPage: true, animations: 'disabled' });
        summary.visual.push({ page: pagePath, width, status: response?.status(), overflow: info.documentWidth > info.viewportWidth + 2, ...info, errors: failures });
      } catch (e) {
        summary.visual.push({ page: pagePath, width, error: String(e) });
      } finally { await page.close(); }
    }
  }
  for (const pagePath of ['/', '/agenda.html', '/elenco.html', '/galeria.html']) {
    try {
      const result = await lighthouse(base + pagePath, {
        port: 9222,
        output: 'html',
        logLevel: 'error',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        formFactor: 'mobile',
        screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 1, disabled: false }
      });
      const name = pagePath === '/' ? 'inicio' : pagePath.replace(/^\\/|\\.html$/g, '');
      await fs.writeFile(path.join(dir, 'lighthouse-' + name + '.html'), result.report);
      summary.lighthouse.push({ page: pagePath, scores: Object.fromEntries(Object.entries(result.lhr.categories).map(([k, v]) => [k, Math.round(v.score * 100)])), lcp: result.lhr.audits['largest-contentful-paint']?.numericValue, cls: result.lhr.audits['cumulative-layout-shift']?.numericValue });
    } catch (e) { summary.lighthouse.push({ page: pagePath, error: String(e) }); }
  }
} finally {
  await browser.close();
  await fs.writeFile(path.join(dir, 'resumo.json'), JSON.stringify(summary, null, 2));
}
const issues = summary.visual.filter(x => x.error || x.overflow || x.status >= 400 || !x.menuPresent || x.errors?.length || x.missingImages?.length);
console.log(JSON.stringify({ lighthouse: summary.lighthouse, visualIssues: issues }, null, 2));
if (issues.length || summary.lighthouse.some(x => x.error)) process.exitCode = 1;
