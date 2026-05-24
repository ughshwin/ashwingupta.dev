const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, 'verify_shots2');
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4328', { waitUntil: 'networkidle' });

  await page.evaluate(() => {
    const s = document.querySelector('.hologram-interface');
    const sec = document.getElementById('experience');
    if (s && sec) s.scrollTop = sec.offsetTop;
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, '1_initial.png') });

  // scroll to show OutLawed area (deep in timeline — 2020-2022 range)
  await page.evaluate(() => { const s = document.querySelector('.hologram-interface'); if (s) s.scrollTop += 1400; });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, '2_outlawed_area.png') });

  // scroll back to mid (2022-2024)
  await page.evaluate(() => { const s = document.querySelector('.hologram-interface'); if (s) s.scrollTop -= 600; });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, '3_mid.png') });

  await ctx.close();
  await browser.close();
  console.log('Done:', OUT);
})();
