import express from "express";
import verifyJwtMiddleware from "../middleware/verifyJwtMiddleware";
import { DecodedIdToken } from "firebase-admin/auth";
import { db } from "../services/firebase";
import * as dateMath from "date-arithmetic";
import admin from "firebase-admin";

const router = express.Router();

type ResponseType = express.Response & {
    locals: express.Response["locals"] & { user: DecodedIdToken }
};

/**
 * GET /scheduled?range=lw|lm
 *
 * lw = last week
 * lm = last month
 *
 * Returns all scheduled meals for this user in that time range.
 */
router.get("/", verifyJwtMiddleware, async (req: express.Request, res: ResponseType) => {
    const range = String(req.query.range || "");

    if (!["lw", "lm"].includes(range)) {
        return res.status(400).json({ error: "range must be 'lw' or 'lm'" });
    }

    try {
        const user = res.locals.user;
        if (!user || !user.uid) {
            return res.status(401).json({ error: "unauthenticated" });
        }

        const now = new Date();
        const startDate = range === "lw"
            ? dateMath.subtract(now, 1, "week")
            : dateMath.subtract(now, 1, "month");

        // Convert to Firestore Timestamp (recommended)
        const tsStart = admin.firestore.Timestamp.fromDate(startDate);
        const tsEnd = admin.firestore.Timestamp.fromDate(now);

        // Query scheduled entries for this user
        const snap = await db.collection("scheduled")
            .where("userId", "==", user.uid)
            .where("lockedAt", ">=", tsStart)
            .where("lockedAt", "<=", tsEnd)
            .orderBy("lockedAt", "desc")
            .get();

        const items = snap.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() || {})
        }));

        return res.status(200).json({
            ok: true,
            count: items.length,
            items
        });

    } catch (err: any) {
        console.error("GET /scheduled error:", err);
        return res.status(500).json({ error: "server error", details: err.message });
    }
});

export default router;
