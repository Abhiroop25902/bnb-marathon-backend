import express from "express";
import readyRouter from "./routes/ready";
import logRouter from "./routes/logs";
import scheduledRouter from "./routes/scheduled";
import userRouter from "./routes/user";
import aiRouter from "./routes/ai";
import cors from "cors";


const app = express()
app.use(express.json())
app.use(cors())

app.use("/ready", readyRouter)
app.use("/logs", logRouter)
app.use("/scheduled", scheduledRouter);
app.use("/user", userRouter);
app.use("/ai", aiRouter);

app.get("/", (req: express.Request, res: express.Response) => {
    res.status(200).send("Hello World!")
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});
