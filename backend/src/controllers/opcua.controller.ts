import StatusCodes from 'http-status-codes';
import { Request, Response } from 'express';

import { paramMissingError } from '@shared/constants';
import { OpcuaClientService } from 'src/services/opcuaClient.service';

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

  const opcua: OpcuaClientService = req.app.get('opcuaClientService');

  variables.forEach((nodeId: string) => {
    opcua.addMonitoredItem(nodeId, (dv) => console.log(nodeId, dv.value.value));
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

  const opcua: OpcuaClientService = req.app.get('opcuaClientService');

  variables.forEach((nodeId: string) => {
    opcua.removeMonitoredItem(nodeId);
  });
  return res.sendStatus(OK);
}

export async function getMonitoredItemsList(req: Request, res: Response) {
  const opcua: OpcuaClientService = req.app.get('opcuaClientService');
  return res.send(opcua.monitoredItemsNodeIds);
}
