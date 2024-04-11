import KafkaConfig from "./config.js";
import { calculateExpenseNotification } from "./utils/CalculateExpenses.js";

const sendMessageToKafka = async (req, res) => {
  try {
    const { message } = req.body;

    let totalExpenses = 0;

    message?.categoryData.forEach((item) => {
      if (item.category === "expense") {
        totalExpenses += item.totalAmount;
      }
    });
    const kafkaConfig = new KafkaConfig();
   
    const messages = [
      {
        key: "key1",
        value: calculateExpenseNotification(
          Number(message.user.budget),
          Number(totalExpenses)
        ),
      },
    ];

    kafkaConfig.produce("my-topic", messages);

    res.status(200).json({
      status: "Ok!",
      message: "Message successfully send!",
    });
  } catch (error) {
    console.log(error);
  }
};

const controllers = { sendMessageToKafka };

export default controllers;
