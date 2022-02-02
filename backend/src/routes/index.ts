import { Router } from 'express';
import opcuaRouter from './opcua-client.router';

// Export the base-router
const baseRouter = Router();
baseRouter.use('/opcua', opcuaRouter);

export default baseRouter;
