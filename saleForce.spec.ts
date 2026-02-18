import test, { chromium } from '@playwright/test'
test('sales force', async({page,context})=>{
    const browser = await chromium.launch({ headless: false })
    const context1 = await browser.newContext()
    const page1 = await context1.newPage()
await page.goto('https://login.salesforce.com/?locale=in')

// Print page title and URl
const title = await page.title()
const url = page.url()
console.log('Page Title:', title)
console.log('Current URL:', url)

await page.locator("#username").fill("dilipkumar.rajendran@testleaf.com")
await page.locator(".password").fill("TestLeaf@2025")
await page.locator('#Login').click()
await page.locator(`[class='slds-icon-waffle']`).click()
await page.waitForTimeout(10000)
await browser.close()

}
)//*[@id="Login"]