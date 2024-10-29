import { Router } from "express";

export const tickersRouter = Router();
tickersRouter.get("/",(req,res)=>{
    res.json({});
})