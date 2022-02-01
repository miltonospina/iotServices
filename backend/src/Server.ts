import cookieParser from 'cookie-parser';
import http from 'http';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { Server as SocketIo } from 'socket.io';
import StatusCodes from 'http-status-codes';
import express, { NextFunction, Request, Response } from 'express';

import 'express-async-errors';

import BaseRouter from './routes';
import logger from 'jet-logger';
import { cookieProps } from '@shared/constants';
import { OpcuaService } from './services/opcua.service';
import { ClientMonitoredItem } from 'node-opcua-client';

const app = express();
const { BAD_REQUEST } = StatusCodes;

const opcuaService: OpcuaService = new OpcuaService();


const fx = async () => {
    try {
        await opcuaService.connect();
        console.log("connected !");
        await opcuaService.createSession();
        console.log("session created !");
        opcuaService.createSubscription();        
    } catch (err) {
        console.log(err);
    }
};
fx();

app.get('/monitoring/add', (req: Request, res: Response) => {    
    const nodeId = req.query.nodeId;
    if(nodeId) {
    opcuaService.addMonitoredItem(nodeId.toString(), d => console.log(d.value.value));
    res.send(opcuaService.monitoredItems.map(mI => mI.itemToMonitor.nodeId.toString()));
    }    
});

app.get('/monitoring/close', (req: Request, res: Response) => {    
    opcuaService.closeSession();
    res.send("done");    
});


/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(cookieProps.secret));

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}

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

// Login page
app.get('/', (req: Request, res: Response) => {
    return res.sendFile('login.html', { root: viewsDir });
});

// Users page
app.get('/users', (req: Request, res: Response) => {
    const jwt = req.signedCookies[cookieProps.key];
    if (!jwt) {
        return res.redirect('/');
    } else {
        return res.sendFile('users.html', { root: viewsDir });
    }
});

// Chat page
app.get('/chat', (req: Request, res: Response) => {
    const jwt = req.signedCookies[cookieProps.key];
    if (!jwt) {
        return res.redirect('/');
    } else {
        return res.sendFile('chat.html', { root: viewsDir });
    }
});



/************************************************************************************
 *                                   Setup Socket.io
 * Tutorial used for this: https://www.valentinog.com/blog/socket-react/
 ***********************************************************************************/

const server = http.createServer(app);
const io = new SocketIo(server);

io.sockets.on('connect', () => {
    return app.set('socketio', io);
});


/************************************************************************************
 *                              Export Server
 ***********************************************************************************/

export default server;
