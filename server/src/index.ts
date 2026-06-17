import express from "express";
import cors from "cors"
import { router } from "./routes/routes.js";
const app = express();
app.use(express.json());
app.use(cors());
app.get("/", (req, res)=>{
    res.status(200).json({
        "message": "Server running successfully"
    })
});
app.use("/api/v1",router);
app.listen(3000, ()=>{
    console.log("Server running");
})