import Redis from 'ioredis'

interface PubSubPromisePayload {
  jobId: string
  [key: string]: any
}

const MAX_TIMEOUT = 10000
interface Job {
  resolve: (payload: any) => void
  timeoutId: NodeJS.Timeout
}

const redisUrl = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`

export default class PubSubPromise<T extends PubSubPromisePayload> {
  jobs = {} as {[jobId: string]: Job}
  publisher = new Redis(redisUrl)
  subscriber = new Redis(redisUrl)
  subChannel: string
  pubChannel: string

  constructor(pubChannel: string, subChannel: string) {
    this.pubChannel = pubChannel
    this.subChannel = subChannel
  }
  onMessage = (_channel: string, message: string) => {
    const payload = JSON.parse(message) as PubSubPromisePayload
    const {jobId, ...rest} = payload
    const cachedJob = this.jobs[jobId]
    if (cachedJob) {
      delete this.jobs[jobId]
      const {resolve, timeoutId} = cachedJob
      clearTimeout(timeoutId)
      resolve(rest)
    }
  }

  subscribe = () => {
    this.subscriber.on('message', this.onMessage)
    this.subscriber.subscribe(this.subChannel)
  }

  publish = (payload: PubSubPromisePayload) => {
    return new Promise<T>((resolve, reject) => {
      const {jobId} = payload
      const timeoutId = setTimeout(() => {
        delete this.jobs[jobId]
        reject(new Error('Redis took too long to respond'))
      }, MAX_TIMEOUT)
      this.jobs[jobId] = {resolve, timeoutId}
      this.publisher.publish(this.pubChannel, JSON.stringify(payload))
    })
  }
}
