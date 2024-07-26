// require('dotenv').config({path: "./env"})
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: "./env"
})

connectDB()
.then( () => {

    app.on("error", () => {
        console.log("EXPRESS ERROR: ", error)
        throw error
    })

    app.listen(process.env.PORT || 8000, () => {
        console.log(`Example app listening on port ${process.env.PORT}`)
    })
})
.catch( (error) => {
    console.log(`Database connection ERROR !!!, ${error}`);
})





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