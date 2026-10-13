// Gera os PDFs e imagens do seminário a partir dos HTMLs desta pasta.
// Uso: NODE_PATH=$(npm root -g) node seminario-whey-protein/src/build.mjs
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, existsSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, '..');
const tmp = path.join(here, '.tmp');
mkdirSync(tmp, { recursive: true });

const browser = await chromium.launch();
const url = (f) => 'file://' + path.join(here, f);

// ---------- Dossiê (A4) ----------
{
  const page = await browser.newPage({ deviceScaleFactor: 2 });
  await page.goto(url('dossie.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  // Fluxograma em PNG (para usar onde quiserem)
  await page.setViewportSize({ width: 820, height: 1200 });
  await page.addStyleTag({ content: 'body{font-size:15px} #flowchart{padding:16px;background:#fff;width:780px}' });
  await page.locator('#flowchart').screenshot({ path: path.join(out, 'fluxograma_whey_concentrado.png'), scale: 'device' });
  await page.reload({ waitUntil: 'networkidle' });

  // Capa (sem margens)
  await page.addStyleTag({ content: '@page{margin:0} #content{display:none}' });
  await page.pdf({ path: path.join(tmp, 'capa.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });

  // Miolo (com numeração de páginas)
  await page.reload({ waitUntil: 'networkidle' });
  await page.addStyleTag({ content: '#cover{display:none}' });
  await page.pdf({
    path: path.join(tmp, 'miolo.pdf'), format: 'A4', printBackground: true,
    margin: { top: '16mm', bottom: '18mm', left: '15mm', right: '15mm' },
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: `<div style="width:100%;font-family:Inter,sans-serif;font-size:7.5px;color:#6b5b95;padding:0 15mm;display:flex;justify-content:space-between">
      <span>Grupo 1 · Whey Protein Concentrado · Dossiê de pesquisa</span>
      <span>pág. <span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
  });
  execFileSync('pdfunite', [path.join(tmp, 'capa.pdf'), path.join(tmp, 'miolo.pdf'),
    path.join(out, 'Dossie_Pesquisa_Whey_Protein_Concentrado.pdf')]);
  await page.close();
}

// ---------- Slides (16:9) ----------
if (existsSync(path.join(here, 'slides.html'))) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 });
  await page.goto(url('slides.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: path.join(out, 'Apresentacao_Whey_Protein_Concentrado.pdf'),
    width: '1280px', height: '720px', printBackground: true, pageRanges: '' });

  // PNG de cada slide (base do PPTX)
  const pngDir = path.join(tmp, 'slides');
  rmSync(pngDir, { recursive: true, force: true });
  mkdirSync(pngDir, { recursive: true });
  const n = await page.locator('.slide').count();
  await page.addStyleTag({ content: '.slide{margin:0!important} body{background:#000} #label-slot > *{visibility:hidden}' });
  for (let i = 0; i < n; i++) {
    // no PPTX o espaço da foto do rótulo fica vazio para inserir a foto real
    await page.locator('.slide').nth(i).screenshot({ path: path.join(pngDir, `s${String(i + 1).padStart(2, '0')}.png`) });
  }
  // posição do espaço da foto do rótulo (para o quadro editável no PPTX)
  const box = await page.evaluate(() => {
    const el = document.getElementById('label-slot'); const sl = el.closest('.slide');
    const a = el.getBoundingClientRect(), b = sl.getBoundingClientRect();
    return { x: a.left - b.left, y: a.top - b.top, w: a.width, h: a.height,
             slide: [...document.querySelectorAll('.slide')].indexOf(sl) + 1 };
  });
  writeFileSync(path.join(tmp, 'label_slot.json'), JSON.stringify(box));
  await page.close();
}

await browser.close();
execFileSync('python3', [path.join(here, 'build_pptx.py')], { stdio: 'inherit' });
console.log('ok');
