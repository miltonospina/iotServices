# iotServices
iotServices (to be renamed as Iiot Services)
Cliente OPCUA con Servidor web.
Incluye servidor OPCUA de demonstración.
API backend express
Frontend en Angular
## Starting the web server
For installing and running the web server in development enviroment, use this command:
```sh
cd backend
npm i
npm run start:dev
```

Webserver also exposes a REST API for handling op.

| METHOD | ENDPOINT | ACTION|
| ------ | ------ |----|
| GET | [/](#) | home page |
| GET | [/api/opcua/monitoring](#) | Return the list of monitored variables |
| POST | [/api/opcua/monitoring](#) | Add variables to the monitored items |
| DELETE | [/api/opcua/monitoring](#) | Remove variables to the monitored items |


## Starting the OPC UA demo server
If you don't have any OPC UA servers at hand, you can use the one included to test the application. For installing and running the OPC UA server, use this command:
```sh
cd opcua-server
npm i
npm run start
```
The OPC UA server exposes an endpoint a [opc.tcp://localhost:4334/UA/MyLittleServer](#); it describes this structure
- **MyDevice:**  `ns=1;i=1000`
    - **MyVariable1:** `ns=1;i=1001` an autoincremental readonly value starting a 1
    - **MyVariable2:** `ns=1;b=d74db4145000` an read/write value initially set on 10
    - **FreeMemory** `ns=1;s=free_memory` the current free memory on the server
 
