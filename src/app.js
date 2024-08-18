import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()

app.get('/', (req, res) => {
    res.send('Hello Backend!')
})


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// Import Routes
import userRouter from "./routes/user.routes.js"
import healthRouter from "./routes/healthcheck.routes.js"

// Routes declaration
app.use("/api/v1/users", userRouter)
// Example Route: http://localhost:3000/api/v1/users/register

app.use("/api/v1", healthRouter)
// Example Route: http://localhost:3000/api/v1/health-check


export {app}