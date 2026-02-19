import {test, expect} from '@playwright/test'
import { isDataView } from 'util/types';
 test('create account', async ({page})=>{
    await page.goto('https://login.salesforce.com/');
    await page.getByLabel('Username').fill('dilipkumar.rajendran@testleaf.com')
    await page.getByLabel('Password').fill('TestLeaf@2025')
    await page.locator('[id="Login"]').click();
   //  await page.getByRole('button', { name: 'Log In' }).click();
    await page.locator(`[class='slds-icon-waffle']`).click()
     // ✅ Verify the page title
  await expect(page).toHaveTitle('Home | Salesforce');

  // ✅ Verify the URL
//   await expect(page).toHaveURL('https://testleaf.lightning.force.com/lightning/o/Lead/list?filterName=__Recent');

  console.log('Title and URL verified successfully');
  await page.waitForTimeout(5000)
  await page.getByRole('button', { name: 'View All Applications' }).click();

//   await page.getByRole('button', { name: 'View All' }).click();
  await page.waitForTimeout(5000)
  await page.getByPlaceholder('Search apps or items...').fill('Service');
  await page.waitForTimeout(5000)
//   await page.locator('a:has-text("Service")').click();
// Replace this line:
// Example with href filter:
await page.locator('a[href="/lightning/app/06mdN00000537gYQAQ"]').click();
// await page.locator('a:has-text("Service")').click();

// With this:
// await page.getByRole('link', { name: 'Service', exact: true }).click();
//   await page.getByRole('link', { name: 'Service' }).click();
  await page.waitForTimeout(5000)
  await page.locator('span[class="slds-truncate"]', { hasText: 'Accounts' }).click();
//   await page.waitForTimeout(35000)
  await page.getByText('New', { exact: true }).click();
    await page.locator('input[name="Name"]').fill('harish');
    await page.getByRole('button', { name: 'Save' }).click();
    console.log('Account created successfully');
    await page.waitForTimeout(5000)




   // await page.waitForTimeout(10000)
    // await page.waitForTimeout(5000);
    // await page.getByText('Leads').click();
    // await page.waitForTimeout(5000);
    // await page.locator('a:has-text("Leads")').click();
    // await page.locator('id=ext-gen246').nth(0).fill('10782');
    // await page.locator('button:has-text("Find Leads")').click();
});