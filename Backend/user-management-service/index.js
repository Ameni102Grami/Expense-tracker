import express from "express";
import { credentials, loadPackageDefinition, status } from "@grpc/grpc-js";
import { fileURLToPath } from "url";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "../db/connectDb.js";

dotenv.config();

const app = express();
const port = 8000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const protoPath = path.resolve(__dirname, "user_service.proto");
const packageDefinition = protoLoader.loadSync(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const userServiceProto = loadPackageDefinition(packageDefinition).user;

connectDB();
const client = new userServiceProto.UserService(
    "localhost:50051",
    credentials.createInsecure(),
);
const corsOptions = {
    origin: "*",
    methods: ["POST", "GET", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.delete("/users/:userId", (req, res) => {
    const userId = req.params.userId;
    client.deleteUser({ userId: userId }, (error, response) => {
        if (error) {
            console.error(error);
            res.status(500).send("Error deleting user");
        } else {
            res.send(response.message);
        }
    });
});

app.put("/users/:userId", (req, res) => {
    const userId = req.params.userId;
    const newName = req.body.name;
    client.updateUser({ userId: userId, name: newName }, (error, response) => {
        if (error) {
            console.error(error);
            res.status(500).send("Error updating user");
        } else {
            res.send(response.message);
        }
    });
});

app.get("/users", (req, res) => {
    client.allUsers({}, (error, response) => {
        if (error) {
            console.error(error);
            res.status(500).send("Error fetching users");
        } else {
            res.send(response.users);
        }
    });
});

app.listen(port, () => {
    console.log(`API Gateway listening at http://localhost:${port}`);
});
