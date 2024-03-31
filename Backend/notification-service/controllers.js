import KafkaConfig from "./config.js";

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
    let notification;

    if (Number(message.user.budget) * 0.9 >= Number(totalExpenses)) {
      notification =
        "Your expenses are covering 90% or nearly 90% of your budget. Please be cautious.";
    } else if (Number(message.user.budget) * 0.8 >= Number(totalExpenses)) {
      notification =
        "Your expenses are covering more than 80% of your budget. Consider reviewing your spending.";
    } else if (Number(message.user.budget) * 0.7 >= Number(totalExpenses)) {
      notification =
        "Your expenses are covering more than 70% of your budget. It's time to reassess your spending habits.";
    } else if (Number(message.user.budget) * 0.6 >= Number(totalExpenses)) {
      notification =
        "Your expenses are covering more than 60% of your budget. You might want to cut down on unnecessary expenses.";
    } else if (Number(message.user.budget) * 0.5 >= Number(totalExpenses)) {
      notification =
        "Your expenses are covering more than 50% of your budget. Take immediate action to reduce expenses.";
    } else if (Number(message.user.budget) * 0.4 >= Number(totalExpenses)) {
      notification =
        "Your expenses are covering more than 40% of your budget. You are spending too much. Take control now!";
    } else if (Number(message.user.budget) * 0.3 >= Number(totalExpenses)) {
      notification =
        "Your expenses are covering more than 30% of your budget. You are on the verge of financial crisis. Act now!";
    } else if (Number(message.user.budget) * 0.2 >= Number(totalExpenses)) {
      notification =
        "Your expenses are covering more than 20% of your budget. Serious financial trouble ahead! Save every penny.";
    } else if (Number(message.user.budget) * 0.1 >= Number(totalExpenses)) {
      notification =
        "Your expenses are covering more than 10% of your budget. Dangerously close to bankruptcy. Save your last dime!";
    } else {
      notification =
        "Your expenses have exceeded your budget. Take immediate steps to control your spending.";
    }
    const messages = [{ key: "key1", value: notification }];

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
