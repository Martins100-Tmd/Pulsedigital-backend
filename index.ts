import type { Request, Response } from "express";
import express from "express";
import cors, { type CorsOptions } from "cors";
import { createServer } from "http";
import { authRouter } from "./router/authRouter";
import { initializeDatabase, } from "./DB";

const app = express();
const httpServer = createServer(app);
app.use(express.json({ limit: "500mb" }));
app.set("port", 3000);

const whiteList = ["https://opportunitypulsedigital.netlify.app", "http://localhost:5173", "http://localhost:3000"]
const corsOption: CorsOptions = {
    origin: function (origin, callback) {
        if (!origin || whiteList.indexOf(origin) != -1) {
            callback(null, true);
            return;
        } else {
            callback(new Error("CORS blocked origin " + origin));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}
app.use(cors(corsOption))


app.get("/", async (req: Request, res: Response) => {
    res.status(200).json({ message: "Server is running!" })
})

app.use("/auth", authRouter);
// app.use("/auth", coRouter);
// app.use("/auth", authRouter);
// app.use("/auth", authRouter);




await initializeDatabase().then(() => {
    httpServer.listen(3000, "0.0.0.0", () => {
        console.log("Server is running on port ", app.get("port"));
    })
})