 import test, { expect } from '@playwright/test'


 test("Update Case account ",async({page})=>{ 
    await page.goto("https://login.salesforce.com/")
    await page.getByLabel('username').fill("dilipkumar.rajendran@testleaf.com")
    await page.getByLabel('password').fill('TestLeaf@2025')
    await page.locator("//input[@id='Login']").click()
    await page.waitForTimeout(5000)
    await page.locator(".slds-icon-waffle").click()
    await page.getByLabel("View All Applications").click()
    await page.waitForTimeout(3000)
    await page.getByRole('link',{name:'Cases',exact:true}).click()
    await page.locator("//span[text()='00001003']").click()
    await page.getByRole('button',{name:'Edit',exact:true}).click()
    await page.getByRole('combobox',{name:'Status'}).click()
    await page.locator("//span[text()='On Hold']").last().click()
    await page.getByRole('combobox',{name:'Priority'}).click()
    await page.locator("//span[text()='Low']").last().click()
    await page.getByRole('combobox',{name:'Case Origin'}).click()
    await page.locator("//span[text()='Phone']").last().click()
    await page.getByRole('button',{name:'Save',exact:true}).click()

 })