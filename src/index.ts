import express from "express";
import readyRouter from "./routes/ready";
import mealLogRouter from "./routes/mealLog";
import scheduledRouter from "./routes/scheduled";
import cors from "cors";


const app = express()
app.use(express.json())
app.use(cors())

app.use("/ready", readyRouter)
app.use("/mealLog", mealLogRouter)
app.use("/scheduled", scheduledRouter);


app.get("/", (req: express.Request, res: express.Response) => {
    res.status(200).send("Hello World!")
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});
