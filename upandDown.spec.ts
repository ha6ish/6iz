import {test,expect} from '@playwright/test';
import path from 'path';
import fs from 'fs';

test("up and down",async({page})=>{
    await page.goto("https://the-internet.herokuapp.com/upload");
// const filePath = path.resolve(__dirname, '  ../../test/uploadFile/');

// await page.setInputFiles('#file-upload', ['sample.txt.txt']);
// await page.click('#file-submit');
// await expect(page.locator('h3')).toHaveText('File Uploaded!');
// await expect(page.locator('#uploaded-files')).toHaveText('sample.txt.txt');
// await page.goto(`https://the-internet.herokuapp.com/upload`)
    const uploadchooser = page.waitForEvent('filechooser',{timeout: 5000})
     page.locator(`//div[@id='drag-drop-upload']`).click()
     const catchEvent = await uploadchooser
     await catchEvent.setFiles(path.join(__dirname, '../../uploadfile/sample-1.png'))
     await expect(page.locator(`//div[@id='drag-drop-upload']`)).toHaveText(/sample-1.*/);

    
    await page.goto(`https://the-internet.herokuapp.com/download`)
    const downloadchooser = page.waitForEvent('download',{timeout: 7000})
    await page.locator("//a[text()='example.json']").click()
    const downevent=await downloadchooser
    await downevent.saveAs(path.join(__dirname,"../../uploadfile/",downevent.suggestedFilename()))
    expect(fs.existsSync(path.join(__dirname,"../../uploadfile/",downevent.suggestedFilename()))).toBeTruthy()
})  

test.only("upload process in web application", async({page})=>{
    await page.goto("https://login.salesforce.com/")
    
    await page.getByLabel('username').fill("dilipkumar.rajendran@testleaf.com")
    await page.getByLabel('password').fill('TestLeaf@2025')
    await page.locator("//input[@id='Login']").click()
    await page.waitForTimeout(5000)
    await page.locator(".slds-icon-waffle").click()
    await page.getByLabel("View All Applications").click()
    await page.waitForTimeout(3000)
    await page.getByPlaceholder("Search apps or items...").fill("Accounts")
    await page.waitForTimeout(3000)
    await page.locator("//mark[text()='Accounts']").click()
   
    await page.getByRole("button",{name:"New"}).click()
    await page.waitForTimeout(3000)
    await page.locator(".slds-input").nth(2).fill("Testnameaccount")
    await page.locator("//button[@aria-label='Type']").click()
    await page.click('[data-value="Prospect"]')
    await page.locator('.slds-combobox_container').nth(4).click()
    await page.click('[data-value="Banking"]')
    await page.locator("//button[text()='Save']").click()
     await expect(page.locator("//span[text()='Success notification.']")).toContainText('Success notification.')
    const uploadfilenew = page.waitForEvent('filechooser',{timeout: 5000})
    await page.locator("//span[text()='Files']").click()
    await page.getByRole('button',{name:'Upload Files'}).click()
    const catchEvent = await uploadfilenew
    await catchEvent.setFiles(path.join(__dirname, '../../uploadfile/sample.png'))
    await expect(page.locator(`//div//div[@class='fileName slds-truncate']`)).toHaveText(/sample.*/);
})


// await page.goto("https://the-internet.herokuapp.com/download");
// const imgPath = path.resolve(__dirname, '../../uploadFile/testFile.txt');
// const [download] = await Promise.all([
//     page.waitForEvent('download'),
//     page.click('')
