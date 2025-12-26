import express from "express";
import {db} from "../services/firebase";
import verifyJwtMiddleware from "../middleware/verifyJwtMiddleware";
import {DecodedIdToken} from "firebase-admin/auth";
import UserPostPayloadSchema from "../schema/UserPostPayloadSchema";
import {Timestamp} from "firebase-admin/firestore";
import {z} from "genkit";
import {UserPatchPayloadSchema} from "../schema/UserPatchPayloadSchema";

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
                details: err,
            });
        }
        return res.status(500).json({error: "server error"});
    }
})

router.patch('/', verifyJwtMiddleware, async (req, res: ResponseType) => {
    const user = res.locals.user;

    try {
        const ref = db.collection("users").doc(user.uid);
        const snap = await ref.get();

        if (!snap.exists) {
            return res.status(404).json({error: "User document does not exist"});
        }

        // 1. Parse partial user update body
        const updatePayload = UserPatchPayloadSchema.parse(req.body);

        // 2. Build update object (convert strings -> Firestore Timestamps)
        const updateData: any = {};

        if (updatePayload.cycle) {
            updateData["cycle"] = {};

            if (updatePayload.cycle.cycleLength !== undefined) {
                updateData.cycle.cycleLength = updatePayload.cycle.cycleLength;
            }

            if (updatePayload.cycle.lastPeriodStart !== undefined) {
                updateData.cycle.lastPeriodStart =
                    Timestamp.fromDate(new Date(updatePayload.cycle.lastPeriodStart));
            }

            if (updatePayload.cycle.previousPeriodStart !== undefined) {
                updateData.cycle.previousPeriodStart =
                    updatePayload.cycle.previousPeriodStart
                        ? Timestamp.fromDate(new Date(updatePayload.cycle.previousPeriodStart))
                        : null;
            }

            if (updatePayload.cycle.thirdLastPeriodStart !== undefined) {
                updateData.cycle.thirdLastPeriodStart =
                    updatePayload.cycle.thirdLastPeriodStart
                        ? Timestamp.fromDate(new Date(updatePayload.cycle.thirdLastPeriodStart))
                        : null;
            }
        }

        if (updatePayload.onboarding) {
            updateData["onboarding"] = {};

            if (updatePayload.onboarding.completed !== undefined) {
                updateData.onboarding.completed = updatePayload.onboarding.completed;
            }

            if (updatePayload.onboarding.completedAt !== undefined) {
                updateData.onboarding.completedAt =
                    Timestamp.fromDate(new Date(updatePayload.onboarding.completedAt));
            }

            if (updatePayload.onboarding.version !== undefined) {
                updateData.onboarding.version = updatePayload.onboarding.version;
            }
        }

        if (updatePayload.preference) {
            updateData["preference"] = {};

            if (updatePayload.preference.proteinTarget !== undefined) {
                updateData.preference.proteinTarget_g =
                    updatePayload.preference.proteinTarget;
            }

            if (updatePayload.preference.sensitivities !== undefined) {
                updateData.preference.sensitivities =
                    updatePayload.preference.sensitivities;
            }

            if (updatePayload.preference.vegetarian !== undefined) {
                updateData.preference.vegetarian = updatePayload.preference.vegetarian;
            }
        }

        // 3. Apply partial update (FireStore merge)
        await ref.set(updateData, {merge: true});

        return res.status(200).json({message: "User updated successfully"});

    } catch (err) {
        console.error(err);

        if (err instanceof z.ZodError) {
            return res.status(400).json({
                error: "Invalid request body",
                details: err
            });
        }

        return res.status(500).json({error: "server error"});
    }
});


export default router;