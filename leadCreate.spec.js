import {test, expect} from '@playwright/test'
 test('create lead in edge', async ({page})=>{

    await page.goto('http://leaftaps.com/opentaps/control/main');
    await page.locator('#username').type('Demosalesmanager');
    await page.locator('#password').type('crmsfa');
    await page.locator('.decorativeSubmit').click();
    await page.locator('a:has-text("CRM/SFA")').click();
    await page.locator('a:has-text("Leads")').click();
    await page.locator('a:has-text("Create Lead")').click();
    await page.locator('#createLeadForm_companyName').type('tstlf');
    await page.locator('#createLeadForm_firstName').type('Harish');
    await page.locator('#createLeadForm_lastName').type('Kumar');
    await page.locator('#createLeadForm_personalTitle').type('TestLeaf');
await page.locator('#createLeadForm_generalProfTitle').type('Mr.');
await page.locator('#createLeadForm_annualRevenue').type('1000000');
await page.locator('#createLeadForm_departmentName').type('Tester');
await page.locator('#createLeadForm_primaryPhoneNumber').type('9962876944');
    
    await page.locator('.smallSubmit').click();
        const title = await page.title();
        console.log(title);



 });