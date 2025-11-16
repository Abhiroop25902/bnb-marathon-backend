import {NextFunction, Request, Response} from "express";
import {firebaseAuth} from "../services/firebaseAuth";

export default async function verifyJwtMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log(`missing token request found for ${req.path}`);
        return res.status(401).json({error: 'Missing token'});
    }

    try {
        const token = authHeader.replace('Bearer ', '');
        res.locals.user = await firebaseAuth.verifyIdToken(token);
        next();
    } catch (error) {
        console.log(`Wrong token request found for ${req.path}`);
        console.log(error);
        res.status(401).json({error: 'Missing token'});
    }

}