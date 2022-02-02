import { Router } from 'express';
import opcuaRouter from './opcua';

// Export the base-router
const baseRouter = Router();
baseRouter.use('/opcua', opcuaRouter);

export default baseRouter;
