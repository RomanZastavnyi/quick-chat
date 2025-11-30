import { Router, Request, Response } from 'express';
import { userService } from '../services/userService.js';

const healthRouter = Router();

healthRouter.get('/', (req: Request, res: Response) => {
    const users = userService.loadAll();
    res.json({ success: true, users });
});

export default healthRouter;