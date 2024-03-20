import Transaction from "../models/transaction.model.js";

const transactionResolver = {
    Query: {
        transactions: async (_, __, context) => {
            try {
                if (!context.getUser()) {
                    throw new Error("Unauthorized");
                }
                const userId = await context.getUser()._id;
                const transactions = await Transaction.find({ user: userId });
                return transactions;
            } catch (err) {
                console.log("Error in getting transactions", err);
                throw new Error("Error in getting transactions");
            }
        },
        transaction: async (_, { transactionId }) => {
            try {
                const transaction = await Transaction.findById(transactionId);
                return transaction;
            } catch (err) {
                console.log("Error in getting transactions", err);
                throw new Error("Error in getting transactions");
            }
        },
    },
    Mutation: {
        createTransaction: async (_, { input }, context) => {
            try {
                const newTransaction = new Transaction({
                    ...input,
                    userId: context.getUser()._id,
                });
                await newTransaction.save();
                return newTransaction;
            } catch (err) {
                console.log("Error in creating transactions", err);
                throw new Error("Error in creating transactions");
            }
        },
        updateTransaction: async (_, { input }) => {
            try {
                const updatedTransaction = await Transaction.findByIdAndUpdate(
                    input.transactionId,
                    input,
                    { new: true },
                );
                return updatedTransaction;
            } catch (err) {
                console.log("Error in updating transactions", err);
                throw new Error("Error in updating transactions");
            }
        },
        deleteTransaction: async (_, { transactionId }) => {
            try {
                const deleteTransaction =
                    await Transaction.findByIdAndDelete(transactionId);
                return deleteTransaction;
            } catch (err) {
                console.log("Error in updating transactions", err);
                throw new Error("Error in updating transactions");
            }
        },
    },
};

export default transactionResolver;
