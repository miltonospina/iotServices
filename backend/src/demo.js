"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const opcua_client_service_1 = require("./services/opcua-client.service");
const clienteweb = new opcua_client_service_1.OpcuaClientService('opc.tcp://localhost:4863');
const mockup = new opcua_client_service_1.OpcuaClientService('opc.tcp://localhost:4334/UA/MyLittleServer');
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield clienteweb.connect();
        yield clienteweb.createSession();
        clienteweb.createSubscription();
        yield mockup.connect();
        yield mockup.createSession();
        mockup.createSubscription();
        console.log('OPCUA client: subscription created');
        const origin = 'ns=1;i=1001';
        const destination = 'ns=1;s=t|SERVIDORES_SERVIDOR1::Programa_Caldera/ENER.Trafo2_V';
        mockup.addMonitoredItem(origin, (dataValue) => {
            clienteweb.writeValue(destination, dataValue.value.value);
        });
        yield new Promise(_ => { });
        mockup.removeMonitoredItem(origin);
        yield mockup.closeSession();
        yield clienteweb.closeSession();
        yield mockup.disconect();
        yield clienteweb.disconect();
        console.log("done !");
    }
    catch (err) {
        console.log('OPCUA client: error', err.message);
    }
}))();
