import "dotenv/config"
import {DBNAME} from "../constants.js"
import mongoose from "mongoose";
import dns from "dns"

dns.setServers(["1.1.1.1"])

const connect = async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODBURI}/${DBNAME}`)
        console.log("DB connected!")
    } catch (error) {
        throw new Error("Error occur while connecting to DB!")
    }
}

export {connect}