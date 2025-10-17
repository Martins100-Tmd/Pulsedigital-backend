import type { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export const getUser = function (req: Request | any, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        res.status(400).json({ message: "No token provided" })
    }

    try {
        let token = authHeader?.split(" ")[1] ?? "";
        let decoded = jwt.verify(token, process.env.JWT_SECRET ?? "") as jwt.JwtPayload;
        req.user = decoded;
    } catch (err) {
        res.status(400).json({ message: "Invalid token provided" });
    }
}

// export const verifyUser = function (req: Request | any, res: Response, next: NextFunction) {
//     const authHeader = req.params.token;
//     if (!authHeader) res.status(400).json({ message: "Verification failed!" });
//     console.log(authHeader);

//     try {
//         let token = authHeader?.split(" ")[1] ?? "";
//         let decoded = jwt.verify(token, process.env.JWT_SECRET ?? "") as jwt.JwtPayload;
//         req.user = decoded;
//     } catch (err) {
//         res.status(400).json({ message: "Invalid token provided" });
//     }
// }