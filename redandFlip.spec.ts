
import { test } from '@playwright/test';

test('redbus in Edge', async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name !== 'Microsoft Edge', 'run only in Microsoft Edge project');
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://www.redbus.in/');
  console.log(await page.title(), page.url());
  await context.close();
});

test('flipkart in WebKit', async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name !== 'webkit', 'run only in WebKit project');
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://www.flipkart.com/');
  console.log(await page.title(), page.url());
  await context.close();
});
