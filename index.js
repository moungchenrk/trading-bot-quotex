const { chromium } = require('playwright');
const TelegramBot = require('node-telegram-bot-api');

// ✅ Telegram Bot Setup
const bot = new TelegramBot("YOUR_BOT_TOKEN", { polling: false });
const chatId = "YOUR_CHAT_ID"; // channel or group ID

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
  setInterval(async () => {
    try {
      const priceElement = await page.$('div.price-value');
      const priceText = await priceElement?.innerText() || "0";
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
      console.error("❌ Error:", err.message);
    }
  }, 5000);
})();
