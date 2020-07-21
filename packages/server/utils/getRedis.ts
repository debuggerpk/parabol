import Redis from 'ioredis'

const redisUrl = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`

let redis: Redis.Redis
const getRedis = () => {
  if (!redis) {
    redis = new Redis(redisUrl)
  }
  return redis
}
export default getRedis
