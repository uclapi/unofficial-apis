import cacheManager from 'cache-manager'
import redisStore from 'cache-manager-ioredis'

const redisCache = cacheManager.caching({
  store: redisStore,
  host: `localhost`,
  ttl: 60 * 5000,
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