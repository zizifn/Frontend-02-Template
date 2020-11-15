const puppeteer = require('puppeteer-core');


(async () => {
    const browser = await puppeteer.launch({
        executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
    });
    const page = await browser.newPage();
    await page.goto('https://www.baidu.com/');
    await page.screenshot({ path: 'example.png' });

    const a = await page.$$('a');

    console.log(a.length);

    await browser.close();
})();