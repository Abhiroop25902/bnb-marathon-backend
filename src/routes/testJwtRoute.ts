import express from "express";
import verifyJwtMiddleware from "../middleware/verifyJwtMiddleware";
import {DecodedIdToken} from "firebase-admin/auth";

const router = express.Router();

type ResponseType = express.Response & {
    locals: express.Response['locals'] & { user: DecodedIdToken }
}

router.get("/", verifyJwtMiddleware, (req: express.Request, res: ResponseType) => {
    res.status(200).json({status: "login successful", userData: res.locals.user});
})

export default router;