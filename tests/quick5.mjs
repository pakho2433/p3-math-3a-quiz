import { chromium } from 'playwright';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const srv = http.createServer((req, res) => { let u = decodeURIComponent(req.url.split('?')[0]); if (u === '/') u = '/index.html';
  const f = path.join(ROOT, u); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, {'Content-Type': {'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json'}[path.extname(f)] || 'application/octet-stream'}); fs.createReadStream(f).pipe(res); });
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${srv.address().port}/`;
const b = await chromium.launch({ args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 900, height: 1100 } }); const errs = [];
p.on('pageerror', e => errs.push(String(e))); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
await p.goto(base); await p.waitForTimeout(1500);
console.log('chip', await p.textContent('#verChip'));
await p.click('#startBtn');
for (let k = 0; k < 6; k++) {
  for (let t = 0; t < 80 && !(await p.evaluate(() => window.__p3quiz.isReady())); t++) await p.waitForTimeout(150);
  const q = await p.evaluate(() => { const Q = window.__p3quiz; return Q.getQs()[Q.getI()]; });
  if (q.type === 'input') { await p.evaluate(v => { for (const ch of v) document.dispatchEvent(new KeyboardEvent('keydown', { key: ch })); }, q.answerValue); 
    await p.keyboard.press('Enter'); }
  else { const wrong = k === 2; const idx = wrong ? (q.answer + 1) % q.options.length : q.answer; await p.click(`#opts .opt >> nth=${idx}`); }
  await p.waitForTimeout(400);
  const fb = (await p.textContent('#fb')) || '';
  console.log(k + 1, q.id, q.type, q.q.slice(0, 30), '|', fb.slice(0, 40).replace(/\s+/g, ' '), 'hearts', await p.evaluate(() => window.__p3quiz.getHearts()));
  for (let t = 0; t < 80; t++) { const vis = await p.evaluate(() => { const n = document.getElementById('next'); return n && !n.classList.contains('hide') && n.offsetParent !== null; }); if (vis) break; await p.waitForTimeout(150); }
  await p.click('#next').catch(e => console.log('next click fail', String(e).slice(0, 80)));
  await p.waitForTimeout(300);
}
console.log('total qs', await p.evaluate(() => window.__p3quiz.getQs().length), 'errors', errs);
await b.close(); srv.close();
