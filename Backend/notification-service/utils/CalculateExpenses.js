export function calculateExpenseNotification(budget, totalExpenses) {
  const expensePercentage = (totalExpenses / budget) * 100; // Calculate the percentage correctly

  if (expensePercentage === 0) {
    return `Your budget is ${budget}. Be mindful not to exceed it.`;
  }
  if (expensePercentage >= 100) {
    return "Your expenses have exceeded your budget. Take immediate steps to control your spending.";
  } else if (expensePercentage >= 90) {
    return "Your expenses are covering 90% or nearly 90% of your budget. Please be cautious.";
  } else if (expensePercentage >= 80) {
    return "Your expenses are covering more than 80% of your budget. Consider reviewing your spending.";
  } else if (expensePercentage >= 70) {
    return "Your expenses are covering more than 70% of your budget. It's time to reassess your spending habits.";
  } else if (expensePercentage >= 60) {
    return "Your expenses are covering more than 60% of your budget. You might want to cut down on unnecessary expenses.";
  } else if (expensePercentage >= 50) {
    return "Your expenses are covering more than 50% of your budget. Take immediate action to reduce expenses.";
  } else if (expensePercentage >= 40) {
    return "Your expenses are covering more than 40% of your budget. You are spending too much. Take control now!";
  } else if (expensePercentage >= 30) {
    return "Your expenses are covering more than 30% of your budget. You are on the verge of financial crisis. Act now!";
  } else if (expensePercentage >= 20) {
    return "Your expenses are covering more than 20% of your budget. Serious financial trouble ahead! Save every penny.";
  } else if (expensePercentage >= 10) {
    return "Your expenses are covering more than 10% of your budget. Dangerously close to bankruptcy. Save your last dime!";
  } else {
    return "Your expenses are within 10% of your budget. You're managing well, keep it up!";
  }
}
