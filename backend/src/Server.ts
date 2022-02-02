import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';

import express, { NextFunction, Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import 'express-async-errors';

import BaseRouter from './routes';
import logger from 'jet-logger';
import { OpcuaClientService } from './services/opcuaClient.service';

const app = express();
const { BAD_REQUEST } = StatusCodes;

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
}

// OpcUA Client Service
const endpointUrl = 'opc.tcp://G14-SYM:4334/UA/MyLittleServer';
const opcuaClientService = new OpcuaClientService(endpointUrl);

(async () => {
  try {
    await opcuaClientService.connect();
    console.log('OPCUA client: connected');

    await opcuaClientService.createSession();
    console.log('OPCUA client: session created');

    opcuaClientService.createSubscription();
    console.log('OPCUA client: subscription created');
  } catch (err) {
    console.log('OPCUA client: error', err.message);
  }
})();

app.set('opcuaClientService', opcuaClientService);

// Add APIs
app.use('/api', BaseRouter);

// Print API errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.err(err, true);
  return res.status(BAD_REQUEST).json({
    error: err.message,
  });
});

/************************************************************************************
 *                              Serve front-end content
 ***********************************************************************************/

const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));
app.get('*', (req: Request, res: Response) => {
  res.sendFile('index.html', { root: viewsDir });
});

// Export express instance
export default app;
