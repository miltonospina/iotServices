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
exports.OpcuaClientService = void 0;
const node_opcua_client_1 = require("node-opcua-client");
const connectionStrategy = {
    initialDelay: 1000,
    maxRetry: 1,
};
const options = {
    applicationName: 'MyClient',
    connectionStrategy: connectionStrategy,
    securityMode: node_opcua_client_1.MessageSecurityMode.None,
    securityPolicy: node_opcua_client_1.SecurityPolicy.None,
    endpointMustExist: false,
};
const parameters = {
    samplingInterval: 100,
    discardOldest: true,
    queueSize: 10,
};
class OpcuaClientService {
    constructor(endpointUrl) {
        this.endpointUrl = '';
        this.monitoredItems = [];
        this.endpointUrl = endpointUrl;
        this.client = node_opcua_client_1.OPCUAClient.create(options);
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('OPCUA client: connecting...');
            return this.client.connect(this.endpointUrl);
        });
    }
    createSession() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('OPCUA client: creating session...');
            this.session = yield this.client.createSession();
        });
    }
    createSubscription() {
        if (!this.session) {
            return;
        }
        this.subscription = node_opcua_client_1.ClientSubscription.create(this.session, {
            requestedPublishingInterval: 1000,
            requestedLifetimeCount: 100,
            requestedMaxKeepAliveCount: 10,
            maxNotificationsPerPublish: 100,
            publishingEnabled: true,
            priority: 10,
        });
        const subId = this.subscription.subscriptionId;
        this.subscription
            .on('started', function () {
            console.log('subscription started for eva - subscriptionId =', subId);
        })
            .on('keepalive', function () {
            console.log('keepalive');
        })
            .on('terminated', function () {
            console.log('terminated');
        });
    }
    closeSession() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.session) {
                yield this.session.close();
            }
        });
    }
    disconect() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.disconnect();
        });
    }
    addMonitoredItem(nodeId, callback) {
        if (this.monitoredItems.find((item) => item.itemToMonitor.nodeId.toString() === nodeId)) {
            return;
        }
        const monitoredItem = node_opcua_client_1.ClientMonitoredItem.create(this.subscription, {
            nodeId: nodeId,
            attributeId: node_opcua_client_1.AttributeIds.Value,
        }, parameters, node_opcua_client_1.TimestampsToReturn.Both);
        monitoredItem.on('changed', (dataValue) => {
            callback(dataValue);
        });
        this.monitoredItems.push(monitoredItem);
    }
    removeMonitoredItem(nodeId) {
        const monitoredItem = this.monitoredItems.find((item) => item.itemToMonitor.nodeId.toString() === nodeId);
        if (monitoredItem) {
            monitoredItem.terminate();
            this.monitoredItems = this.monitoredItems.filter((item) => item.itemToMonitor.nodeId.toString() !== nodeId);
        }
    }
    get monitoredItemsNodeIds() {
        return this.monitoredItems.map((item) => item.itemToMonitor.nodeId.toString());
    }
    writeValue(nodeId, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.session) {
                return;
            }
            return yield this.session.write({
                nodeId: nodeId,
                attributeId: node_opcua_client_1.AttributeIds.Value,
                value: {
                    value: {
                        value: value,
                        dataType: node_opcua_client_1.DataType.Double,
                    },
                }
            });
        });
    }
    readValue(nodeId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.session) {
                return;
            }
            return yield this.session.read({
                nodeId: nodeId,
                attributeId: node_opcua_client_1.AttributeIds.Value,
            });
        });
    }
}
exports.OpcuaClientService = OpcuaClientService;
