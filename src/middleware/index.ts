import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = req.headers.authorization?.split(" ")[1] ?? "";

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        res.locals.userData = decoded;
        next();
        return;
    } catch (err) {
        res.status(401).json({ err });
    }
};