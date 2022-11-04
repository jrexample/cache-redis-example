const redisClient = require('../redis');

const generateCacheKey = (req) => {
  const query = Object.keys(req.query).length > 0 ? `_${JSON.stringify(req.query)}` : '';
  const key = `CACHE_${req.route.path}${query}`;

  return key;
};

const cacheMiddleware = async (
  req,
  res,
  next,
) => {
  const key = generateCacheKey(req);
  const cache = await redisClient.get(key);

  if (cache) {
    return res.json(JSON.parse(cache));
  }

  return next();
}

module.exports = {
  cacheMiddleware,
  generateCacheKey,
};
