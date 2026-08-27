import { Request , Response } from "express";

export function healthCheck (_req: Request, res: Response ){
    res.status(200).json({
        "status": "healthy",
        "timestamp": "2026-06-06T12:00:00"
    })
}