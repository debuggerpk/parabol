import Redis from 'ioredis'
import {ServerChannel} from 'parabol-client/types/constEnums'

const redisUrl = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
const publisher = new Redis(redisUrl)
const subscriber = new Redis(redisUrl)

const onMessage = async (_channel: string, message: string) => {
  const payload = JSON.parse(message)
  const executeGraphQL = require('../server/graphql/executeGraphQL').default
  const result = await executeGraphQL(payload)
  publisher.publish(
    ServerChannel.GQL_EXECUTOR_RESPONSE,
    JSON.stringify({...result, jobId: payload.jobId})
  )
}

subscriber.on('message', onMessage)
subscriber.subscribe(ServerChannel.GQL_EXECUTOR_REQUEST)
console.log(`\n💧💧💧 Ready for GraphQL Execution 💧💧💧`)

if (module.hot) {
  module.hot.accept('../server/graphql/executeGraphQL')
}
