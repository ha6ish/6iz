import  {test} from '@playwright/test'
test('callback type', async ({page})=>{

    
//  Use a different name to avoid conflicts with Playwright's browser object
let myBrowser = "Chrome";

// accepts callback
function checkBrowserVersion(callback: { (version: any): void; (arg0: string): void; }) {
    setTimeout(() => {
        // callback with our variable
        callback(myBrowser);
    }, 2000);
}

// Callback function to log the browser version
function logBrowserVersion(version: any) {
    console.log("Browser version is:", version);
}


checkBrowserVersion(logBrowserVersion);
await page.waitForTimeout(2000)
})

