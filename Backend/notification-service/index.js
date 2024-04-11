import express from "express";
import controllers from "./controllers.js";
import KafkaConfig from "./config.js";
import { connectDB } from "./db/connectDb.js";
import dotenv from "dotenv";
import { createClient } from "redis";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const app = express();
dotenv.config();
await connectDB();
app.use(express.json());

// Swagger options
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Expense Notification API",
      version: "1.0.0",
      description: "An API to manage expense notifications",
    },
    servers: [
      {
        url: "http://localhost:9096",
      },
    ],
  },
  apis: ["./index.js"], // Path to the API docs
};

// Initialize swagger-jsdoc
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Use swagger-ui-express for serving the Swagger UI
app.use(
  "/notification-api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs)
);

/**
 * @swagger
 * /send:
 *   post:
 *     summary: Send a message to Kafka
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message sent successfully
 */
app.post("/send", controllers.sendMessageToKafka);

const kafkaConfig = new KafkaConfig();
const client = await createClient()
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

kafkaConfig.consume("my-topic", async (value) => {
  await client.set("value", value);
});
await client.set("key", "value");

app.get("/notifications", async (req, res) => {
  const value = await client.get("value");
  res.json({ message: value });
});

app.listen(9096, () => {
  console.log(`Server is running on port 9096.`);
});
