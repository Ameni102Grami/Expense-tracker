import express from "express";
import controllers from "./controllers.js";
import KafkaConfig from "./config.js";
import { connectDB } from "./db/connectDb.js";
import dotenv from "dotenv";
import { createClient } from "redis";

const app = express();
dotenv.config();
await connectDB();
app.use(express.json());
app.post("/send", controllers.sendMessageToKafka);

const kafkaConfig = new KafkaConfig();
const client = await createClient()
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

await client.set("key", "value");
const value = await client.get("value");

kafkaConfig.consume("my-topic", async (value) => {
  await client.set("value", value);
});

app.get("/notifications", async (req, res) => {
  res.json({ message: value });
});
app.listen(9096, () => {
  console.log(`Server is running on port 9096.`);
});
