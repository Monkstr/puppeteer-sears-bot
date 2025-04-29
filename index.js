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
    const searchUrl = https://www.searspartsdirect.com/all/search?searchTerm=${model};
    const response = await axios.get(searchUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 ...' },
    maxRedirects: 5
  });

    if (response.status !== 200) {
      return res.status(404).json({ error: 'Model not found or server error' });
    }

    const html = response.data;
    const $ = cheerio.load(html);

    // Ищем ссылку на первый товар в результатах поиска
    const firstProductLink = $('.product-card a[href]').first().attr('href');

    if (!firstProductLink) {
      return res.json({ message: Не удалось найти схему для модели: ${model} });
    }

    // Формируем полную ссылку (если она не абсолютная)
    const fullLink = firstProductLink.startsWith('http') 
      ? firstProductLink 
      : https://www.searspartsdirect.com${firstProductLink};

    return res.json({ 
      model: model,
      partsDiagramLink: fullLink 
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Ошибка при поиске модели' });
  }
});

app.get('/', (req, res) => {
  res.send('Сервер работает. Используйте POST / с параметром { "model": "41741912510" }');
});

app.listen(port, () => {
  console.log(Server running on port ${port});
});
