import express from "express";
import { User } from "../DB";

export const authRouter = express.Router();


authRouter.post("/create", async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        res.status(400).json({ message: "Missing input field" });
        return;
    }

    (await User.create({ firstName, lastName, email, password })).save();

    res.status(200).json({ message: "user account created successfully!" });
})

authRouter.get("/users", async (req, res) => {
    const users = await User.findAll();
    res.status(200).json({ message: "users", users })
})