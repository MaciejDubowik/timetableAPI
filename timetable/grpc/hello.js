import * as protoLoader from "@grpc/proto-loader";
import * as grpc from "@grpc/grpc-js";

const packageDefinition = protoLoader.loadSync('./grpc.proto');

const helloProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

const bindAddress = '127.0.0.1:50052';

server.bindAsync(bindAddress, grpc.ServerCredentials.createInsecure(), (error, port) => {
  if (error) {
    console.error(`Failed to bind to ${bindAddress}: ${error}`);
  } else {
    console.log(`Server running at http://${bindAddress}`);
    server.start();
  }
});
