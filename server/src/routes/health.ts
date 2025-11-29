import { Router, Request, Response } from 'express';

const healthRouter = Router();

healthRouter.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK' });
});

export default healthRouter;