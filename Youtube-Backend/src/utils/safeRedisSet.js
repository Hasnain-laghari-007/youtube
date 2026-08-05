import { redis } from "../redis/config.js"
const safeRedisSet = async(key,value) => {
    try {
        await redis.set(key,JSON.stringify(value),"EX",2*60)
        console.log('Key updated or set successfully!')
    } catch (error) {
        console.log('Redis Error while setting value!!')
    }
}

export {safeRedisSet}