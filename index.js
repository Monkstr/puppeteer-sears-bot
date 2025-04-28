const express = require('express');
const puppeteer = require('puppeteer-core');
const app = express();
app.use(express.json());

app.post('/', async (req, res) => {
  const model = req.body.model;
  if (!model) return res.status(400).send({ error: 'Model is required' });

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: process.env.CHROME_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
  });

  const page = await browser.newPage();
  await page.goto(`https://www.searspartsdirect.com/all/search?searchTerm=${model}`, { waitUntil: 'networkidle2' });

  const result = await page.evaluate(() => {
    const link = document.querySelector('a[href*="/model/"]');
    return link ? link.href : null;
  });

  await browser.close();

  if (!result) {
    return res.status(404).send({ error: 'Model not found' });
  }

  res.send({ modelLink: result });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
