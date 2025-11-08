import express from "express";
import {cert, initializeApp} from "firebase-admin/app";

if(process.env.FIREBASE_ADMIN_JSON){
    //in dev docker
    const fireBaseAdminJson = JSON.parse(process.env.FIREBASE_ADMIN_JSON);
    initializeApp({credential: cert(fireBaseAdminJson)});
}else{
    // in firebase
    initializeApp();
}

const app = express()
app.use(express.json())

app.get("/", (req: express.Request, res: express.Response) => {
    res.status(200).send("Hello World!")
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});
