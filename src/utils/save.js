const fs = require('fs');
const path = require('path');

const URL_FILE_PATH = path.join(__dirname, 'urls.json');

function loadURLs() {
    if (!fs.existsSync(URL_FILE_PATH)) {
        return [];
    }
    const data = fs.readFileSync(URL_FILE_PATH, 'utf8');
    return JSON.parse(data);
}

function saveURLs(urls) {
    fs.writeFileSync(URL_FILE_PATH, JSON.stringify(urls, null, 2), 'utf8');
}

function addURL(newURL, productData) {
    const urls = loadURLs();
    const existingURL = urls.find(url => url.url === newURL);

    if (!existingURL) {
        urls.push({ url: newURL, data: productData });
        saveURLs(urls);
    }
}

module.exports = {
    loadURLs,
    addURL,
    get URLs() {
        return loadURLs();
    }
};
