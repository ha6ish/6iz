// import {test} from '@playwright/test';
// import { ok } from 'node:assert';

// test("dialog",async({page})=>{
//     await page.goto("https://www.w3schools.com/js/tryit.asp?filename=tryjs_confirm")
//     await page.frameLocator("#iframeResult").getByRole("button", { name: "Try it" }).click()
//     page.on("dialog",async dialog=>{
//         console.log(dialog.message())
//         await dialog.accept()
//     })})

import { test,expect } from '@playwright/test';

test("dialog", async ({ page }) => {

    await page.goto("https://www.w3schools.com/js/tryit.asp?filename=tryjs_confirm");

    // Register dialog handler BEFORE click
    page.once("dialog", async dialog => {
        console.log(dialog.message());
        await dialog.accept(); // or dialog.dismiss();
    });

    await page.frameLocator("#iframeResult")
        .getByRole("button", { name: "Try it" })
        .click();
        const result = page.frameLocator("//iframe[@id='iframeResult']").locator("#demo")
    await expect.soft(result).toContainText("You pressed OK!")

});