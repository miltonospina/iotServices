import { OpcuaClientService } from "../backend/src/services/opcua-client.service";

const clienteweb = new OpcuaClientService("opc.tcp://localhost:4863");
const mockup = new OpcuaClientService(
  "opc.tcp://localhost:4334/UA/MyLittleServer"
);

(async () => {
  try {
    await clienteweb.connect();
    await clienteweb.createSession();
    clienteweb.createSubscription();

    await mockup.connect();
    await mockup.createSession();
    mockup.createSubscription();

    console.log("OPCUA client: subscription created");

    const origin = "ns=1;i=1001";
    const destination =
      "ns=1;s=t|SERVIDORES_SERVIDOR1::Programa_Caldera/ENER.Trafo2_V";

    mockup.addMonitoredItem(origin, (dataValue) => {
      clienteweb.writeValue(destination, dataValue.value.value);
    });
    await new Promise((_) => {});

    mockup.removeMonitoredItem(origin);

    await mockup.closeSession();
    await clienteweb.closeSession();
    await mockup.disconect();
    await clienteweb.disconect();

    console.log("done !");
  } catch (err: any) {
    console.log("OPCUA client: error", err.message);
  }
})();
