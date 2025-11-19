import express from "express";
import verifyJwtMiddleware from "../middleware/verifyJwtMiddleware";
import {DecodedIdToken} from "firebase-admin/auth";
import {db} from "../services/firebase";
import * as dateMath from 'date-arithmetic'

const router = express.Router();

type ResponseType = express.Response & {
    locals: express.Response['locals'] & { user: DecodedIdToken }
}

router.get("/", verifyJwtMiddleware, async (req: express.Request, res: ResponseType) => {
    const {range} = req.query // will be lw for last week or lm for last month

    if (typeof range !== "string" || !["lw", "lm"].includes(range)) {
        console.error("proper range is required");
        res.status(500).json({error: "server error"});
    }

    try {
        const user = res.locals.user;

        const durationEndDate = new Date();
        const durationStartDate = range == "lw" ? dateMath.subtract(durationEndDate, 1, "week") : dateMath.subtract(durationEndDate, 1, "month");

        const snap = await db.collection("logs")
            .where("userId", "==", user.uid)
            .where("createdAt", ">=", durationStartDate)
            .where("createdAt", "<=", durationEndDate)
            .orderBy("createdAt", "desc").get();


        res.status(200).json(snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })));
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "server error"});
    }


})

export default router;