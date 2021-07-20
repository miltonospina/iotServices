import { AttributeIds, OPCUAClient } from "node-opcua-client";

const timeout = (ms: number) => {
    return new Promise((resolve, reject) => setTimeout(() => resolve , ms));
};

const endpointUrl2 = "opc.tcp://G14-SYM:4334/UA/MyLittleServer";

(async () => {
    try {

        const client = OPCUAClient.create({
            endpointMustExist: false
        });
        await client.connect(endpointUrl2);
        console.log("connected !");

        const session = await client.createSession();
        console.log("session created !");



        const browseResult = await session.browse("RootFolder");
        
        if(browseResult.references !== null){
            console.log("references of RootFolder :");
            for(const reference of browseResult.references) {
                console.log( "   -> ", reference.browseName.toString());
            }
        }


        const maxAge = 0;
        const nodeToRead = {
          nodeId: "ns=1;s=free_memory",
          attributeId: AttributeIds.Value
        };
        const dataValue =  await session.read(nodeToRead, maxAge);
        console.log(" value " , dataValue.toString());
        

        //await timeout(5000);
        await session.close();
        console.log("session closed !");

        await client.disconnect();
        console.log("done !");
    }
    catch (err) {
        console.log(err.message);
        process.exit(0);
    }
})()

