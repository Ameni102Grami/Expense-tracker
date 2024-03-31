import express from "express";
import controllers from "./controllers.js";
import KafkaConfig from "./config.js";
import { connectDB } from "./db/connectDb.js";
import dotenv from "dotenv";

const app = express();
dotenv.config();
await connectDB();
app.use(express.json());
app.post("/send", controllers.sendMessageToKafka);

const kafkaConfig = new KafkaConfig();

// New GET route to consume messages from Kafka
app.get("/notifications", (req, res) => {
 kafkaConfig.consume("my-topic", (value) => {
    // Process the message here, for example, by sending it as a response
    console.log("📨 Receive message: ", value);
    res.json({ message: value });
 });
});

app.listen(9096, () => {
  console.log(`Server is running on port 9096.`);
});
