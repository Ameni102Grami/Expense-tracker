import express from "express";
import { credentials, loadPackageDefinition } from "@grpc/grpc-js";
import { fileURLToPath } from "url";
import protoLoader from "@grpc/proto-loader";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import connectMongo from "connect-mongodb-session";
import { createClient } from "redis";
import { connectDB } from "./db/connectDb.js";
import session from "express-session";

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
  credentials.createInsecure()
);
const corsOptions = {
  origin: "*",
  methods: ["POST", "GET", "PATCH", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const MongoDBStore = connectMongo(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

store.on("error", (error) => console.log(error));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    },
    store,
  })
);
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Service API",
      version: "1.0.0",
      description: "API for managing users",
    },
    servers: [
      {
        url: "http://localhost:8000",
      },
    ],
  },
  apis: ["./index.js"],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const redisClient = await createClient()
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();
app.post("/users/auth", async (req, res) => {
  await redisClient.set("user", JSON.stringify(req.body.user));
  res.send("Authenticated");
});
const user = JSON.parse(await redisClient.get("user"));

app.use("/user-api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(cors(corsOptions));
/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Delete a user by ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       500:
 *         description: Error deleting user
 */
app.delete("/users/:userId", (req, res) => {
  const userId = req.params.userId;
  if (user._id && user?.role === "ADMIN") {
    client.deleteUser({ userId: userId }, (error, response) => {
      if (error) {
        console.error(error);
        return res.status(500).send("Error deleting user");
      } else {
        return res.send(response.message);
      }
    });
  } else return res.status(401).send("UnAuthorized");
});

/**
 * @swagger
 * /users/{userId}:
 *   put:
 *     summary: Update a user by ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user to update.
 *               username:
 *                 type: string
 *                 description: The new username of the user.
 *               name:
 *                 type: string
 *                 description: The new name of the user.
 *               profilePicture:
 *                 type: string
 *                 description: The new profile picture URL of the user.
 *               gender:
 *                 type: string
 *                 description: The new gender of the user.
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the update was successful.
 *       500:
 *         description: Error updating user
 */
app.put("/users/:userId", (req, res) => {
  const userId = req.params.userId;
  if (user._id && user?.role === "ADMIN") {
    client.updateUser({ userId, ...req.body }, (error, response) => {
      if (error) {
        console.error(error);
        return res.status(500).send("Error updating user");
      } else {
        return res.send(response.message);
      }
    });
  } else return res.status(401).send("UnAuthorized");
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve all users
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The unique identifier of the user.
 *                   username:
 *                     type: string
 *                     description: The username of the user.
 *                   name:
 *                     type: string
 *                     description: The name of the user.
 *                   password:
 *                     type: string
 *                     description: The password of the user.
 *                   profilePicture:
 *                     type: string
 *                     description: The URL of the user's profile picture.
 *                   gender:
 *                     type: string
 *                     description: The gender of the user.
 *                   updatedAt:
 *                     type: string
 *                     description: The date and time the user was last updated.
 *                   createdAt:
 *                     type: string
 *                     description: The date and time the user was created.
 */
app.get("/users", async (req, res) => {
  if (user._id && user?.role === "ADMIN") {
    client.allUsers({}, (error, response) => {
      if (error) {
        console.error(error);
        return res.status(500).send("Error fetching users");
      } else {
        return res.send(response.users);
      }
    });
  } else return res.status(401).send("UnAuthorized");
});

app.listen(port, () => {
  console.log(`User Server listening at http://localhost:${port}`);
});
