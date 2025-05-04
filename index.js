const { chromium } = require('playwright');
const TelegramBot = require('node-telegram-bot-api');

// ✅ Telegram Bot Setup
const bot = new TelegramBot("8116152551:AAF3EjeKuNPGQS_MeHsvYAuP68FaKMHG_2c", { polling: false });
const chatId = "-1002262735570"; // channel or group ID

let previousPrice = null;

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("🔓 Logging into Quotex...");
  await page.goto("https://qxbroker.com/en/login");
  await page.fill('input[name="email"]', "putolrk10@gmail.com");
  await page.fill('input[name="password"]', "Laburkk1@");
  await page.click('button[type="submit"]');
  await page.waitForTimeout(5000);

  console.log("✅ Logged in. Going to trade page...");
  await page.goto("https://qxbroker.com/en/trade");
  await page.waitForTimeout(10000);

  console.log("📡 Monitoring Live Price...");
while (true) {
  try {
    const priceElement = await page.$('div.price-value');
    if (!priceElement) {
      console.log("❌ Could not find price element.");
      continue;
    }

    const priceText = await priceElement.innerText();
    const currentPrice = parseFloat(priceText);
    console.log(`💰 Price: ${currentPrice}`);

    if (previousPrice !== null) {
      if (currentPrice > previousPrice) {
        await bot.sendMessage(chatId, "📈 Quotex Signal: BUY");
      } else if (currentPrice < previousPrice) {
        await bot.sendMessage(chatId, "📉 Quotex Signal: SELL");
      }
    }

    previousPrice = currentPrice;

  } catch (err) {
    console.error("❌ Error inside price fetch:", err);
  }

  await new Promise(resolve => setTimeout(resolve, 5000));
}
})();
