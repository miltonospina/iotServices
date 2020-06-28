class SocketIO_service{
    constructor(server) {
        if (!!SocketIO_service.instance) {
            return SocketIO_service.instance;
        }
        SocketIO_service.instance = this;

        this.io =  require('socket.io')(server)

        this.io.sockets.on('connection', (socket) => {});

        return this;
    }
    
    emit(mensaje){
        this.io.sockets.emit('message', mensaje);
    }


}
module.exports = {SocketIO_service}