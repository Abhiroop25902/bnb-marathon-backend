import express from "express";
import {db} from "../services/firebase";
import verifyJwtMiddleware from "../middleware/verifyJwtMiddleware";
import {DecodedIdToken} from "firebase-admin/auth";
import UserPostPayloadSchema from "../schema/UserPostPayloadSchema";
import {Timestamp} from "firebase-admin/firestore";
import {z} from "zod";

type ResponseType = express.Response & {
    locals: express.Response['locals'] & { user: DecodedIdToken }
}

const router = express.Router();

router.get("/me", verifyJwtMiddleware, async (req, res: ResponseType) => {
    const user = res.locals.user;

    try {
        const ref = db.collection("users").doc(user.uid);
        const snap = await ref.get();

        if (!snap.exists) {
            return res.status(404).json({error: "User not found"});
        }

        const data = snap.data();

        res.status(200).json({id: snap.id, ...data});
    } catch (err) {
        console.error("Error fetching user", err);
        return res.status(500).json({error: "server error"});
    }
})


router.post('/', verifyJwtMiddleware, async (req, res: ResponseType) => {
    const user = res.locals.user;

    try {
        const existingUserDataSnap = await db.collection("users").doc(user.uid).get();

        if (existingUserDataSnap.exists) {
            return res.status(409).json({error: "Document already exists"});
        }

        const givenUserData = UserPostPayloadSchema.parse(req.body);

        const ref = db.collection("users").doc(user.uid);
        await ref.set({
            ...givenUserData,
            cycle: {
                ...givenUserData.cycle,
                lastPeriodStart: Timestamp.fromDate(new Date(givenUserData.cycle.lastPeriodStart)),
            },
            onboarding: {
                ...givenUserData.onboarding,
                completedAt: Timestamp.fromDate(new Date(givenUserData.onboarding.completedAt)),
            }
        });

        return res.status(201).json({id: ref.id})
    } catch (err) {
        console.error(err);

        if (err instanceof z.ZodError) {
            return res.status(400).json({
                error: "Invalid request body",
                details: z.treeifyError(err),
            });
        }
        return res.status(500).json({error: "server error"});
    }
})

export default router;