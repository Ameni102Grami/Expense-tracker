import express from "express";
import controllers from "./controllers.js";
import KafkaConfig from "./config.js";
import { connectDB } from "./db/connectDb.js";
import dotenv from "dotenv";

const app = express();
dotenv.config();
await connectDB();
app.use(express.json());
app.post("/api/send", controllers.sendMessageToKafka);

const kafkaConfig = new KafkaConfig();
// console.log({ kafkaConfig });
kafkaConfig.consume("my-topic", (value) => {
  console.log("📨 Receive message: ", value);
});

app.listen(9096, () => {
  console.log(`Server is running on port 9096.`);
});
