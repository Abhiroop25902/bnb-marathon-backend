import express from "express";
import verifyJwtMiddleware from "../middleware/verifyJwtMiddleware";
import {DecodedIdToken} from "firebase-admin/auth";
import {db} from "../services/firebase";

type ResponseType = express.Response & {
    locals: express.Response['locals'] & { user: DecodedIdToken }
}

const router = express.Router();

router.delete('/:id', verifyJwtMiddleware, async (req, res: ResponseType) => {
    const user = res.locals.user;
    const recId = req.params.id;

    try {
        const ref = db.collection("today_recommendations").doc(recId);
        const snap = await ref.get();

        if (!snap.exists) {
            return res.status(404).json({error: "recommendation not found"});
        }

        const data = snap.data();

        // @ts-ignore
        if (data['userId'] !== user.uid) {
            return res.status(401).json({error: "unauthorized"});
        }

        await ref.delete();

        return res.status(200).json({...data});

    } catch (err) {
        return res.status(500).json({error: "server error"});
    }
})

export default router