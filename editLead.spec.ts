import {test, expect} from '@playwright/test'
import { isDataView } from 'util/types';
 test('create lead in edge', async ({page})=>{
//    const { chromium } = require('playwright');
//    const browser = await chromium.launch({ headless: false });

// // Create incognito context
// const context = await browser.newContext();

// // Open page inside incognito
// const page1 = await context.newPage();

    await page.goto('http://leaftaps.com/opentaps/control/main');
    await page.locator('#username').type('Demosalesmanager');
    await page.locator('#password').type('crmsfa');
    await page.locator('.decorativeSubmit').click();
    await page.locator('a:has-text("CRM/SFA")').click();
   await page.locator('a:has-text("Leads")').click();
   const findLeads = page.getByRole('link', { name: 'Find Leads' });
   await findLeads.waitFor({ state: 'visible', timeout: 8000 });
   await findLeads.click();
   await page.reload({ waitUntil: 'load' });

   //  await page.getByRole('link', { name: 'Find Leads' }).click();
   // await page.getByRole('link', { name: 'Find Leads' }).click().catch(() => {
   //    console.log('First click failed, trying again...');
   //    return page.getByRole('link', { name: 'Find Leads' }).click();
   //  });

   //  await page.waitForTimeout(5000);
   //  await page.getByRole('link', { name: 'Find Leads' }).click();
   //  await page.getByRole('link', { name: 'Find Leads' }).click();
   //  await page.locator('a[href="/crmsfa/control/findLeads"]').click();
   //await page.getByText('Find Leads').click();
   // await page.locator('id=ext-gen857').click();
   //  await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);
   //  await page.getByRole('link',{name: 'firstName'}).click();
    await page.locator('id=ext-gen248').last().click();
    await page.locator('id=ext-gen248').fill('Harish');
    // await page.locator('input[name="firstName"]').type('Harish');
    await page.locator('button:has-text("Find Leads")').click();
    await page.waitForTimeout(5000);
    await page.getByRole('link', { name: '10234' }).click();
    await page.locator('a:has-text("Edit")').click();
    const valu1= await page.locator('id=updateLeadForm_companyName').fill('TestLeaf')
    console.log("value of company name", valu1)
    const valu2= await page.locator('id=updateLeadForm_annualRevenue').fill('10000000');
    console.log("value of annual revenue", valu2)
    const valu3= await page.locator('id=updateLeadForm_departmentName').fill('QA ENGG');
    console.log("value of department name", valu3)
    const valu4= await page.locator('id=updateLeadForm_description').fill('updated');
    console.log("value of description", valu4)
    await page.getByRole('button', { name: 'Update' }).click();

   //  await page.locator('id=ext-gen632').click();
    const title = await page.title();
    await page.waitForTimeout(5000);
    await page.goto('https://login.salesforce.com/');
    await page.getByLabel('Username').fill('dilipkumar.rajendran@testleaf.com')
    await page.getByLabel('Password').fill('TestLeaf@2025')
    await page.locator('[id="Login"]').click();
   //  await page.getByRole('button', { name: 'Log In' }).click();
    await page.locator(`[class='slds-icon-waffle']`).click()
     // ✅ Verify the page title
  await expect(page).toHaveTitle('Home | Salesforce');

  // ✅ Verify the URL
  await expect(page).toHaveURL('https://testleaf.lightning.force.com/lightning/o/Lead/list?filterName=__Recent');

  console.log('Title and URL verified successfully');
    await page.waitForTimeout(10000)
    // await page.waitForTimeout(5000);
    // await page.getByText('Leads').click();
    // await page.waitForTimeout(5000);
    // await page.locator('a:has-text("Leads")').click();
    // await page.locator('id=ext-gen246').nth(0).fill('10782');
    // await page.locator('button:has-text("Find Leads")').click();
});