// require('dotenv').config({path: "./env"})

import dotenv from "dotenv"
import connectDB from "./db/index.js";

dotenv.config({
    path: "./env"
})

connectDB()

// Database connection, approach
// import mongoose from "mongoose";
// import {DB_NAME} from "constants";
/*
import express from "express"
const app = express()

( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        app.on("error", () => {
            console.log("EXPRESS ERROR: ", error)
            throw error
        })
        
        app.listen(port, () => {
            console.log(`Example app listening on port ${process.env.port}`)
        })

    } catch (error) {
        console.log("DB ERROR: ", error)
        throw error
    }
} )()
*/