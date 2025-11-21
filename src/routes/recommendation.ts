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
        const todayDateString = new Date().toISOString().split("T")[0];
        const ref = db.collection(`users/${user.uid}/recommendations`).doc(todayDateString);
        const snap = await ref.get();

        if (!snap.exists) {
            return res.status(404).json({error: "recommendation not found"});
        }

        const data = snap.data();

        //@ts-ignore
        const updatedItems = data.items.filter(e => e.id !== recId);

        //@ts-ignore
        const deletedItem = data.items.filter(e => e.id === recId);

        await ref.set({
            ...data,
            items: updatedItems,
        });

        return res.status(200).json(deletedItem);

    } catch (err) {
        return res.status(500).json({error: "server error"});
    }
})

export default router