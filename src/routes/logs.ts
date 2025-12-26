import express from "express";
import verifyJwtMiddleware from "../middleware/verifyJwtMiddleware";
import {DecodedIdToken} from "firebase-admin/auth";
import {db} from "../services/firebase";
import * as dateMath from 'date-arithmetic'
import {z} from "genkit";
import LogPostPayloadSchema from "../schema/LogPostPayloadSchema";
import {Timestamp} from "firebase-admin/firestore";
import getMacros from "../usecase/logs.usecase";

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

router.post("/", verifyJwtMiddleware, async (req: express.Request, res: ResponseType) => {
    const user = res.locals.user;

    try {
        const log = LogPostPayloadSchema.parse(req.body);
        
        const macroDetailPromise = log.imgUrl ? getMacros(log.imgUrl) : Promise.resolve(undefined);
        const createdAt = Timestamp.fromDate(new Date(log.createdAt));

        const ref = db.collection("logs").doc();

        const macroDetails = await macroDetailPromise;

        await ref.set({
            ...log,
            ...macroDetails,
            userId: user.uid,
            createdAt: createdAt,
        })

        return res.status(201).json({id: ref.id});

    } catch (err) {
        console.error(err);

        if (err instanceof z.ZodError) {
            return res.status(400).json({
                error: "Invalid request body",
                details: err,
            });
        }
        return res.status(500).json({error: "server error"});
    }
})

export default router;