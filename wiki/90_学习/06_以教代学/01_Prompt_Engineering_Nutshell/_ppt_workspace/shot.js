const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 960, height: 540 } });
  for (let i = 1; i <= 16; i++) {
    const f = `slide${String(i).padStart(2, '0')}.html`;
    await p.goto('file://' + process.cwd() + '/' + f);
    await p.screenshot({ path: `shot${String(i).padStart(2, '0')}.png` });
  }
  await b.close();
  console.log('done');
})();
