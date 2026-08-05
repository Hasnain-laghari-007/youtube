import { redis } from "../redis/config.js"
const safeRedisGet = async(key) => {
    try {
        const value = await redis.get(key)
        if(value === null) return null
        return JSON.parse(value)
    } catch (error) {
        console.log('Redis Error while getting value!!')
        return null
    }
}
export {safeRedisGet}