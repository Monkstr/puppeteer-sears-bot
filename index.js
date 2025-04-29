const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/', async (req, res) => {
  const model = req.body.model;
  if (!model) {
    return res.status(400).json({ error: 'Model is required' });
  }

  try {
    const searchUrl = `https://www.searspartsdirect.com/all/search?searchTerm=${model}`;
    const response = await axios.get(searchUrl);
    const html = response.data;
    const $ = cheerio.load(html);

    // Новый способ поиска ссылки
    const firstProductLink = $('.product-card a[href]').first().attr('href');

    if (!firstProductLink) {
      return res.json({ message: `Не удалось найти взрыв-схему для модели: ${model}` });
    }

    const fullLink = `https://www.searspartsdirect.com${firstProductLink}`;
    return res.json({ modelLink: fullLink });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Ошибка при поиске модели' });
  }
});

app.get('/', (req, res) => {
  res.send('Сервер работает.');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
