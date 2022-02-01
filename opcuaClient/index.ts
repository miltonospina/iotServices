import {
    OPCUAClient,
    MessageSecurityMode, SecurityPolicy,
    AttributeIds,
    ClientSubscription,
    TimestampsToReturn,
    MonitoringParametersOptions,
    ClientMonitoredItem,
    DataValue,
    OPCUAClientOptions,
    ConnectionStrategyOptions
  } from "node-opcua-client";
  
  const timeOut = (timeout: number) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(timeout)
      }, timeout)
    })
  }
  
  const connectionStrategy: ConnectionStrategyOptions = {
    initialDelay: 1000,
    maxRetry: 1
  }
  
  const options: OPCUAClientOptions = {
    applicationName: "MyClient",
    connectionStrategy: connectionStrategy,
    securityMode: MessageSecurityMode.None,
    securityPolicy: SecurityPolicy.None,
    endpointMustExist: false,
  };
  const client = OPCUAClient.create(options);
  //const endpointUrl = "opc.tcp://localhost:4863";
  const endpointUrl = "opc.tcp://CLIENTEWEB:4334/UA/MyLittleServer";
  
  
  async function main() {
    try {
      // step 1 : connect to
      await client.connect(endpointUrl);
      console.log("connected !");
  
  
      // step 2 : createSession
      const session = await client.createSession();
      console.log("session created !");
  
      const nodeToRead = {
        //nodeId: "ns=1;s=t|SERVIDORES_SERVIDOR1::Control_Loops/Scale_8/FF-102.IN",
        nodeId:"ns=1;b=1020FFAA",
        attributeId: AttributeIds.Value
      };
    
  
  
      // step 5: install a subscription and install a monitored item for 10 seconds
      const subscription = ClientSubscription.create(session, {
        requestedPublishingInterval: 1000,
        requestedLifetimeCount: 100,
        requestedMaxKeepAliveCount: 10,
        maxNotificationsPerPublish: 100,
        publishingEnabled: true,
        priority: 10
      });
  
      subscription.on("started", function () {
        console.log("subscription started for eva - subscriptionId =", subscription.subscriptionId);
      }).on("keepalive", function () {
        console.log("keepalive");
      }).on("terminated", function () {
        console.log("terminated");
      });
  
  
      // install monitored item
  
      const parameters: MonitoringParametersOptions = {
        samplingInterval: 100,
        discardOldest: true,
        queueSize: 10
      };
  
      const monitoredItem = ClientMonitoredItem.create(
        subscription,
        nodeToRead,
        parameters,
        TimestampsToReturn.Both
      );
  
      monitoredItem.on("changed", (dataValue: DataValue) => {
        console.log(" value has changed : ", dataValue.value.value);
      });

    
  
      //await for ever; never resolves
      await new Promise(_ => { });
  
      console.log("now terminating subscription");
      await subscription.terminate();
  
      // close session
      await session.close();
  
      // disconnecting
      await client.disconnect();
      console.log("done !");
    } catch (err) {
      console.log("An error has occured : ", err);
    }
  }
  
  main();