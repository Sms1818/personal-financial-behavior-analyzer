import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
    }
  });
  
  page.on('pageerror', error => {
    console.log('UNCAUGHT EXCEPTION:', error.message, error.stack);
  });

  console.log("Navigating to login...");
  await page.goto('http://localhost:5173/login');
  
  await page.fill('input[type="email"]', 'sahil@gmail.com');
  await page.fill('input[type="password"]', 'password');
  await page.click('button[type="submit"]');
  
  console.log("Waiting for navigation to dashboard...");
  await page.waitForTimeout(2000); // Wait for login to complete

  console.log("Navigating to insights...");
  await page.goto('http://localhost:5173/insights');
  await page.waitForTimeout(3000);
  
  console.log("Done checking.");
  await browser.close();
})();
