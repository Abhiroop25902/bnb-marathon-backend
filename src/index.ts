import express from "express";
import {cert, initializeApp} from "firebase-admin/app";
import readyRouter from "./ready/readyRouter";


const app = express()
app.use(express.json())
app.use("/ready", readyRouter)

app.get("/", (req: express.Request, res: express.Response) => {
    res.status(200).send("Hello World!")
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});
