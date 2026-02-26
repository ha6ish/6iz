import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test.describe('File Upload and Download Automation', () => {

  const documentPath = path.join(__dirname, '../test-data/sample.pdf');
  const imagePath = path.join(__dirname, '../test-data/image.png');

  test('Upload and Download Files without clicking buttons', async ({ page }) => {

    
    // FILE UPLOAD

    await page.goto('https://the-internet.herokuapp.com/upload');

    // Upload without clicking Upload button
    await page.setInputFiles('#file-upload', documentPath);

    // Click upload button only to trigger server upload (not selecting file)
    await page.locator('#file-submit').click();

    // Assertion
    await expect(page.locator('h3')).toHaveText('File Uploaded!');
    await expect(page.locator('#uploaded-files')).toHaveText('sample.pdf');

    console.log('Document uploaded successfully');


    // ============================
    // IMAGE UPLOAD (Red Square)
    // ============================

    await page.goto('https://the-internet.herokuapp.com/upload');

    // Using fileChooser event
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.click('#file-upload'),
    ]);

    await fileChooser.setFiles(imagePath);

    await page.click('#file-submit');

    await expect(page.locator('h3')).toHaveText('File Uploaded!');
    await expect(page.locator('#uploaded-files')).toHaveText('image.png');

    console.log('Image uploaded successfully');

    // FILE DOWNLOAD

    await page.goto('https://the-internet.herokuapp.com/download');

    const [download] = await Promise.all([
       page.waitForEvent('download'),
      page.click('text=file.json'),
    ]);

    const downloadPath = path.join(__dirname, '../test-data/file.json');

    await download.saveAs(downloadPath);

    // Assertion - check file exists
    const fileExists = fs.existsSync(downloadPath);
    expect(fileExists).toBeTruthy();

    console.log('File downloaded successfully at:', downloadPath);
  });

});