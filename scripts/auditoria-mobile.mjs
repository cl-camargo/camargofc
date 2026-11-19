import { chromium } from 'playwright';
import lighthouse from 'lighthouse';
import fs from 'node:fs/promises';
import path from 'node:path';

const base = 'https://camargofc.com.br';
const pages = ['/', '/noticias.html', '/agenda.html', '/elenco.html', '/estatisticas.html', '/galeria.html', '/historia.html', '/patrocinadores.html'];
const widths = [360, 390, 430, 768, 1366];
const dir = 'auditoria-output';
await fs.mkdir(dir, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--remote-debugging-port=9222'] });
const summary = { date: new Date().toISOString(), base, visual: [], interactions: [], lighthouse: [] };
try {
  for (const pagePath of pages) {
    for (const width of widths) {
      const page = await browser.newPage({ viewport: { width, height: 800 }, deviceScaleFactor: 1, isMobile: width < 768, hasTouch: width < 768 });
      const failures = [];
      page.on('pageerror', e => failures.push(e.message));
      try {
        const response = await page.goto(base + pagePath, { waitUntil: 'domcontentloaded', timeout: 45000 });
        await page.waitForTimeout(1200);
        // Carregar imagens lazy antes de verificar falhas de arquivo.
        await page.evaluate(async () => { for (const img of document.images) img.loading = 'eager'; await Promise.all([...document.images].map(img => Promise.race([img.decode().catch(() => {}), new Promise(resolve => setTimeout(resolve, 5000))]))); });
        const info = await page.evaluate(() => ({
          documentWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth,
          menuPresent: Boolean(document.querySelector('#site-menu nav')),
          missingImages: [...document.images].filter(i => i.complete && i.naturalWidth === 0 && i.getAttribute('src')).map(i => i.getAttribute('src')).slice(0, 20)
        }));
        const name = pagePath === '/' ? 'inicio' : pagePath.slice(1).replace('.html', '').replace(/[^a-z0-9-]/gi, '-');
        await page.screenshot({ path: path.join(dir, name + '-' + width + '.jpeg'), fullPage: true, animations: 'disabled', type: 'jpeg', quality: 70 });
        summary.visual.push({ page: pagePath, width, status: response?.status(), overflow: info.documentWidth > info.viewportWidth + 2, ...info, errors: failures });
        if (width === 390) {
          if (pagePath === '/galeria.html') {
            await page.locator('.galeria-tab[onclick*="gal-bastidores"]').click();
            const input = page.locator('#cfc-busca-gal-bastidores');
            await input.fill('termo-que-nao-existe-123456');
            const hiddenCount = await page.locator('#gal-bastidores .galeria-card[hidden]').count();
            summary.interactions.push({ page: pagePath, action: 'filtro da galeria', passed: hiddenCount > 0 });
            await page.locator('#gal-bastidores .cfc-gallery-tools button').click();
            summary.interactions.push({ page: pagePath, action: 'limpar filtro', passed: await page.locator('#gal-bastidores .galeria-card[hidden]').count() === 0 });
            // Legendas repetidas são válidas: várias fotos podem documentar a mesma campanha.
            const captions = await page.locator('#gal-jogos .galeria-card-titulo').allTextContents();
            const repeated = captions.some((caption, i) => captions.indexOf(caption) !== i);
            summary.interactions.push({ page: pagePath, action: 'legendas repetidas preservadas', passed: repeated });
            const selected = page.locator('.galeria-tab[aria-selected="true"]');
            summary.interactions.push({ page: pagePath, action: 'aba acessível selecionada', passed: await selected.count() === 1 });
            await selected.focus();
            await page.keyboard.press('ArrowLeft');
            summary.interactions.push({ page: pagePath, action: 'navegação por teclado nas abas', passed: await page.locator('.galeria-tab[aria-selected="true"]').count() === 1 && await page.locator('.galeria-tab[aria-selected="true"]').getAttribute('aria-controls') === 'gal-jogos' });
          }
          if (pagePath === '/estatisticas.html') {
            summary.interactions.push({ page: pagePath, action: 'ranking oficial carregado', passed: await page.locator('#stats-dashboard-v2 .v2-ranking-card').count() === 2 });
            const toggle = page.locator('.stats-section-toggle').first();
            await toggle.click();
            summary.interactions.push({ page: pagePath, action: 'acordeão de partidas', passed: await toggle.getAttribute('aria-expanded') === 'true' });
          }
          if (pagePath === '/elenco.html') {
            summary.interactions.push({ page: pagePath, action: 'ordem campo antes do futsal', passed: await page.evaluate(() => document.querySelector('#elenco-campo')?.compareDocumentPosition(document.querySelector('#elenco-futsal')) & Node.DOCUMENT_POSITION_FOLLOWING ? true : false) });
          }
        }
      } catch (e) {
        summary.visual.push({ page: pagePath, width, error: String(e) });
      } finally { await page.close(); }
    }
  }
  for (const pagePath of pages) {
    try {
      const result = await lighthouse(base + pagePath, {
        port: 9222,
        output: 'html',
        logLevel: 'error',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        formFactor: 'mobile',
        screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 1, disabled: false }
      });
      const name = pagePath === '/' ? 'inicio' : pagePath.slice(1).replace('.html', '');
      await fs.writeFile(path.join(dir, 'lighthouse-' + name + '.html'), result.report);
      summary.lighthouse.push({ page: pagePath, scores: Object.fromEntries(Object.entries(result.lhr.categories).map(([k, v]) => [k, Math.round(v.score * 100)])), lcp: result.lhr.audits['largest-contentful-paint']?.numericValue, cls: result.lhr.audits['cumulative-layout-shift']?.numericValue });
    } catch (e) { summary.lighthouse.push({ page: pagePath, error: String(e) }); }
  }
} finally {
  await browser.close();
  await fs.writeFile(path.join(dir, 'resumo.json'), JSON.stringify(summary, null, 2));
}
const rows = summary.lighthouse.map(x => '| ' + x.page + ' | ' + (x.scores ? x.scores.performance : 'Erro') + ' | ' + (x.scores ? x.scores.accessibility : '-') + ' | ' + (x.scores ? x.scores['best-practices'] : '-') + ' | ' + (x.scores ? x.scores.seo : '-') + ' |').join('\n');
await fs.writeFile(path.join(dir, 'RELATORIO.md'), '# Auditoria Camargo FC — ' + summary.date + '\n\n| Página | Performance | Acessibilidade | Boas práticas | SEO |\n|---|---:|---:|---:|---:|\n' + rows + '\n\nResultados detalhados e capturas no mesmo artefato.\n');
const issues = summary.visual.filter(x => x.error || x.overflow || x.status >= 400 || !x.menuPresent || x.errors?.length || x.missingImages?.length);
console.log(JSON.stringify({ lighthouse: summary.lighthouse, visualIssues: issues, interactions: summary.interactions }, null, 2));
if (issues.length || summary.lighthouse.some(x => x.error) || summary.interactions.some(x => !x.passed)) process.exitCode = 1;
