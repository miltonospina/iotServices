import {
  OPCUAClient,
  MessageSecurityMode,
  SecurityPolicy,
  AttributeIds,
  ClientSubscription,
  TimestampsToReturn,
  MonitoringParametersOptions,
  ClientMonitoredItem,
  DataValue,
  OPCUAClientOptions,
  ConnectionStrategyOptions,
} from 'node-opcua-client';

const connectionStrategy: ConnectionStrategyOptions = {
  initialDelay: 1000,
  maxRetry: 1,
};

const options: OPCUAClientOptions = {
  applicationName: 'MyClient',
  connectionStrategy: connectionStrategy,
  securityMode: MessageSecurityMode.None,
  securityPolicy: SecurityPolicy.None,
  endpointMustExist: false,
};

const parameters: MonitoringParametersOptions = {
  samplingInterval: 100,
  discardOldest: true,
  queueSize: 10,
};

export class OpcuaClientService {
  endpointUrl = '';

  client: OPCUAClient;
  session: any;
  subscription: any;
  monitoredItems: ClientMonitoredItem[] = [];

  constructor(endpointUrl: string) {
    this.endpointUrl = endpointUrl;
    this.client = OPCUAClient.create(options);
  }

  async connect() {
    console.log('OPCUA client: connecting...');
    return this.client.connect(this.endpointUrl);
  }

  async createSession() {
    console.log('OPCUA client: creating session...');
    this.session = await this.client.createSession();
  }

  createSubscription() {
    this.subscription = ClientSubscription.create(this.session, {
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

  async closeSession() {
    return this.session.close();
  }

  async disconect() {
    return this.client.disconnect();
  }

  addMonitoredItem(nodeId: string, callback: (d: DataValue) => void) {
    if (this.monitoredItems.find((item) => item.itemToMonitor.nodeId.toString() === nodeId)) {
      return;
    }
    const monitoredItem = ClientMonitoredItem.create(
      this.subscription,
      {
        nodeId: nodeId,
        attributeId: AttributeIds.Value,
      },
      parameters,
      TimestampsToReturn.Both
    );

    monitoredItem.on('changed', (dataValue: DataValue) => {
      callback(dataValue);
    });

    this.monitoredItems.push(monitoredItem);
  }

  removeMonitoredItem(nodeId: string) {
    const monitoredItem = this.monitoredItems.find((item) => item.itemToMonitor.nodeId.toString() === nodeId);

    if (monitoredItem) {
      monitoredItem.terminate();
      this.monitoredItems = this.monitoredItems.filter((item) => item.itemToMonitor.nodeId.toString() !== nodeId);
    }
  }

  get monitoredItemsNodeIds() {
    return this.monitoredItems.map((item) => item.itemToMonitor.nodeId.toString());
  }
}
