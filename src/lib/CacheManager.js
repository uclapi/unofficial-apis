import cacheManager from 'cache-manager'
import redisStore from 'cache-manager-ioredis'

const redisCache = cacheManager.caching({
  store: redisStore,
  host: process.env.REDIS_HOST || `localhost`,
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  ttl: process.env.REDIS_TTL || 60 * 5000,
})

const redisClient = redisCache.store.getClient()

redisClient.on(`error`, error => {
  console.error(error)
})

const TTLS = {
  MODULE_CATALOGUE: 7 * 24 * 60 * 60 * 1000,
  SOCIETIES: 7 * 24 * 60 * 60 * 1000
}

export default {
  wrap: redisCache.wrap,
  TTLS,
}