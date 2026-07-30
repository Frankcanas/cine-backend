// app/src/routes/membership.routes.ts
    
    import { Router } from "express";
    import { createMembership } from "../controllers/membership.controller";
    
    const router = Router();
    
    /**
     * POST /membership/create (o POST / con prefijo en el server)
     */
    router.post("/create", createMembership);
    
    export default router;