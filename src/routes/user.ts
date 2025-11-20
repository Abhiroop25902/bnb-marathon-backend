import express from "express";
import {db} from "../services/firebase";
import verifyJwtMiddleware from "../middleware/verifyJwtMiddleware";
import {DecodedIdToken} from "firebase-admin/auth";

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

export default router;