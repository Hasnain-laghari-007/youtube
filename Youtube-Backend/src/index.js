import "dotenv/config"
import { app } from "./app.js";
import { connect } from "./db/connect.js";
import { redis } from "./redis/config.js";
const port = process.env.PORT || 5000

connect()
.then(()=>{
    app.listen(port,()=>{
        console.log("Server is running on port",port)
    })
})
.catch((err)=>console.log(err.message))