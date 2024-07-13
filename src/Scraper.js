const puppeteer = require('puppeteer');

class Scraper {
    constructor(url) {
        this.url = url;
    }

    async scrapePage() {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(this.url, { waitUntil: 'networkidle2' });

        const data = await page.evaluate(() => {
            const jsonLdScript = document.querySelector('script[type="application/ld+json"]');
            const jsonLd = JSON.parse(jsonLdScript.textContent);

            let description = '';
            if (Array.isArray(jsonLd['@graph'])) {
                for (const item of jsonLd['@graph']) {
                    if (item['@type'] === 'Product') {
                        description = item.description || '';
                        break;
                    }
                }
            } else if (jsonLd['@type'] === 'Product') {
                description = jsonLd.description || '';
            }

            const title = document.querySelector('title').innerText.trim();
            const price = document.querySelector('#content > div.showcase > div.buybox.showcase__buybox > div.buybox__buy-content > div.buybox__buy-content--info > div.price > div.price-box > div > div > span').innerText.trim();
            const imageElements = document.querySelectorAll('link[rel="preload"][as="image"]');
            const images = Array.from(imageElements)
                .map(el => el.href.replace(/(\?.*)/, '')) 
                .filter((value, index, self) => self.indexOf(value) === index); 

            return { title, price, images, description };
        });

        await browser.close();
        return data;
    }
}

module.exports = Scraper;
