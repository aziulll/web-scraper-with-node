const readline = require("readline");
const { addURL } = require("./src/utils/save.js");
const URL = require("./src/utils/url.js");
const Scraper = require("./src/Scraper.js");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function loadData(url) {
  const scraper = new Scraper(url);
  try {
    console.log("Scraping...");
    const productData = await scraper.scrapePage();
    console.log("Collected data:");
    console.log(productData);
    addURL(url, productData);
  } catch (error) {
    console.error("Error fetching product data", error);
  }
}

async function processAllURLs() {
  const urls = URL;
  for (const url of urls) {
    await loadData(url);
  }
}

async function addNewURL() {
  return new Promise((resolve) => {
    rl.question("New url: ", async (url) => {
      await loadData(url);
      resolve();
    });
  });
}

async function main() {
  let option = "";
  while (option !== "0") {
    console.log("1. All URLs");
    console.log("2. Add new URL");
    console.log("0. Exit");

    option = await askQuestion("Choose an option: ");

    switch (option) {
      case "1":
        await processAllURLs();
        break;
      case "2":
        await addNewURL();
        break;
      case "0":
        rl.close();
        console.log("Exiting..");
        break;
      default:
        console.log("Invalid option. Try again.");
    }
  }
}

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

main();
