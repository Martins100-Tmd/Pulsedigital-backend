import express, { type Request, type Response } from "express";
import { User } from "../DB";
import { accessToken, Token } from "../util/token";
import { sendMail } from "../util/mail";
import * as jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const authRouter = express.Router();


authRouter.post("/create", async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        res.status(400).json({ message: "Missing input field" });
        return;
    }
    const token = Token(`${firstName} ${lastName}`, password, email);

    await sendMail(token, email);

    res.status(200).json({ message: "verification email sent" });
})

authRouter.get("/users", async (req, res) => {
    const users = await User.findAll();
    res.status(200).json({ message: "users", users })
})


authRouter.get("/verify", async (req: Request, res: Response) => {
    const token = req.query.token as string;

    if (!token) {
        return res.status(400).json({ message: "Verification failed! Token missing." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "") as jwt.JwtPayload;
        const { name, email, password } = decoded;

        const findUser = await User.findOne({ where: { email } });
        if (findUser) { res.status(400).json({ message: "user already exist" }); return };


        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        (await User.create({ name, email, password: hashedPassword })).save()

        res.status(201).json({ message: "Email verified successfully!", data: { name, email, token } });

    } catch (err) {
        res.status(400).json({ message: "Invalid or expired token." });
    }
});


authRouter.post("/signin", async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: "Please fill in required field!" });
        return;
    }

    const findUser = await User.findOne({ where: { email } })
    if (findUser) {
        const isMatch = await bcrypt.compare(password, findUser.password);
        const token: string = accessToken(findUser.password, findUser.email);
        if (isMatch) res.status(200).json({ message: "login successful", name: findUser.name, email, token });
        return;
    }

    res.status(400).json({ message: "Error signing in" });
})