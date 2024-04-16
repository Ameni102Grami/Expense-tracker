import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./db/connectDb.js";
import User from "./models/user.model.js";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const protoPath = path.resolve(__dirname, "user_service.proto");
const packageDefinition = protoLoader.loadSync(protoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const userServiceProto = grpc.loadPackageDefinition(packageDefinition).user;

function deleteUser(call, callback) {
  const userId = call.request.userId;

  User.findByIdAndDelete(userId)
    .then((deletedUser) => {
      if (!deletedUser) {
        throw new Error("User not found");
      }
      callback(null, { message: "User deleted successfully" });
    })
    .catch((err) => {
      callback(err);
    });
}

function updateUser(call, callback) {
  const userId = call.request.userId;

  const body = call.request;
  User.findByIdAndUpdate(userId, { userId, ...body })
    .then((updatedUser) => {
      if (!updatedUser) {
        throw new Error("User not found");
      }
      callback(null, { message: "User updated successfully" });
    })
    .catch((err) => {
      callback(err);
    });
}

function getAllUsers(call, callback) {
  User.find({})
    .then((users) => {
      const response = {
        users: users,
      };
      callback(null, response);
    })
    .catch((err) => {
      callback(err, null);
    });
}


const server = new grpc.Server();
server.addService(userServiceProto.UserService.service, {
  deleteUser: deleteUser,
  updateUser: updateUser,
  allUsers: getAllUsers,
 
});

const port = 50051;

connectDB()
  .then(() => {
    console.log("Database connected successfully.");
    server.bindAsync(
      `0.0.0.0:${port}`,
      grpc.ServerCredentials.createInsecure(),
      () => {
        console.log(`gRPC server running at http://0.0.0.0:${port}`);
        server.start();
      }
    );
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });
