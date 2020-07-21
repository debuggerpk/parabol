import Redis from 'ioredis'
import GraphQLRedisPubSub from './GraphQLRedisPubSub'

const redisUrl = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`

let pubsub: GraphQLRedisPubSub
const getPubSub = () => {
  if (!pubsub) {
    const pub = new Redis(redisUrl)
    const sub = new Redis(redisUrl)
    pubsub = new GraphQLRedisPubSub(pub, sub)
  }
  return pubsub
}
export default getPubSub
