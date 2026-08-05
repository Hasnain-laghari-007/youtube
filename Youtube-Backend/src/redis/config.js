import "dotenv/config"
import Redis from "ioredis"

const redis = new Redis(process.env.REDIS_URI || "redis://localhost:6379")

redis.on("connect",()=>console.log('Redis connected!'))
redis.on("error",(err)=>console.log("Redis Error :",err))
redis.on("reconnecting",()=>console.log('Redis reconnecting!'))

export {redis}