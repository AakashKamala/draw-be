import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const userAuth = async (req: Request, res: Response, next: NextFunction): Promise<any> =>{
    try {
        const token = req.header("brainauthtoken");
        if (!token) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const verified: any = jwt.verify(token, process.env.JWT_SECRET as string);
        req.userId = verified.id;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}