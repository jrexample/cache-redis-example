const express = require('express');
const { cacheMiddleware, generateCacheKey } = require('./middlewares/cache.middleware');
const redisClient = require('./redis');

const app = express();
const port = process.env.PORT || 3000;

const ONE_MINUTE = 60;

// Hanya untuk contoh, misalnya get data memerlukan 2 detik
const getDataFromDatabase = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 1,
        name: 'Jacky Rusly'
      });
    }, 2000);
  });
};

(async () => {
  await redisClient.connect();

  app.get('/', cacheMiddleware, async (req, res) => {
    const data = await getDataFromDatabase();

    const key = generateCacheKey(req);
    await redisClient.setEx(key, ONE_MINUTE, JSON.stringify(data));

    res.json({
      data,
    });
  });

  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
})();
