import { Router } from 'express';
import { addMonitoredItem, getMonitoredItemsList, readValue, removeMonitoredItem, writeValue } from '../controllers/opcua-client.controller';

// User-route
const opcuaRouter = Router();

opcuaRouter.get('/monitoring', getMonitoredItemsList);
opcuaRouter.post('/monitoring', addMonitoredItem);
opcuaRouter.delete('/monitoring', removeMonitoredItem);


opcuaRouter.post('/value', writeValue);
opcuaRouter.get('/value', readValue);
export default opcuaRouter;
