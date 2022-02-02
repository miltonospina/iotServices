import { Router } from 'express';
import { addMonitoredItem, getMonitoredItemsList, removeMonitoredItem } from '../controllers/opcua.controller';

// User-route
const opcuaRouter = Router();

opcuaRouter.get('/monitoring', getMonitoredItemsList);
opcuaRouter.post('/monitoring', addMonitoredItem);
opcuaRouter.delete('/monitoring', removeMonitoredItem);

export default opcuaRouter;
