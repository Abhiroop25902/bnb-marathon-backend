import express from "express";
import readyRouter from "./routes/ready";
import testJwtRoute from "./routes/testJwtRoute";


const app = express()
app.use(express.json())
app.use("/ready", readyRouter)
app.use("/testJwtRoute", testJwtRoute)

app.get("/", (req: express.Request, res: express.Response) => {
    res.status(200).send("Hello World!")
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});
