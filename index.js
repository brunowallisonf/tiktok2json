const puppeteer = require('puppeteer');
const transformPageToJson = async (page) => page.evaluate(() => new Promise((resolve, reject) => {

    const videoElement = document.getElementsByTagName("video")[0]
    const mediaUrl = videoElement.getAttribute("src")
    const titleElement = document.getElementsByClassName("tt-video-meta-caption")[0].textContent
    const authorNick = document.getElementsByClassName("author-nickname")[0].textContent
    const authorUsername = document.getElementsByClassName("author-uniqueId")[0].textContent
    return resolve({ author: authorNick, authorUsername, title: [titleElement], media: [{ mediaUrl, isVideo: true }], })

}));


export default (link) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36")
    await page.goto(link);
    await page.screenshot({ path: 'example.png' });
    page.on('console', msg => {
        console.log(msg._text)
    });
    const result = await transformPageToJson(page);
    console.log(result)
    await browser.close();
}

