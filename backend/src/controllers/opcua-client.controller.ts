import StatusCodes from 'http-status-codes';
import { Request, Response } from 'express';

import { paramMissingError } from '@shared/constants';
import { OpcuaClientService } from 'src/services/opcua-client.service';

import SocketIO from 'socket.io';

const { BAD_REQUEST, CREATED, OK } = StatusCodes;

/**
 * Add a item to monitored item list.
 *
 * @param req
 * @param res
 * @returns
 */
export async function addMonitoredItem(req: Request, res: Response) {
  const { variables } = req.body;
  if (!variables) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }

  const opcua: OpcuaClientService = req.app.get('opcua');
  const io: SocketIO.Server = req.app.get('socketio');

  variables.forEach((nodeId: string) => {
    opcua.addMonitoredItem(nodeId, (dataValue) => {
      io.emit('data', { nodeId, value: dataValue.value.value });
      console.log(`${nodeId}: ${dataValue.value.value}`);
    });
  });
  return res.sendStatus(CREATED);
}

/**
 * Remove a item from monitored item list.
 *
 * @param req
 * @param res
 * @returns
 */
export async function removeMonitoredItem(req: Request, res: Response) {
  const { variables } = req.body;
  if (!variables) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }

  const opcua: OpcuaClientService = req.app.get('opcua');

  variables.forEach((nodeId: string) => {
    opcua.removeMonitoredItem(nodeId);
  });
  return res.sendStatus(OK);
}

/**
 * Get a list of all monitored items.
 *
 * @param req
 * @param res
 * @returns
 */
export async function getMonitoredItemsList(req: Request, res: Response) {
  const opcua: OpcuaClientService = req.app.get('opcua');
  return res.send(opcua.monitoredItemsNodeIds);
}
