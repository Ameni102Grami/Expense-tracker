import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./db/connectDb.js";
import Transaction from "./models/transaction.model.js";
import bcrypt from "bcryptjs";
import User from "./models/user.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const protoPath = path.resolve(__dirname, "auth_and_transaction.proto");
const packageDefinition = protoLoader.loadSync(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const financeapp = grpc.loadPackageDefinition(packageDefinition).financeapp;

var getUser = {};
const authenticationService = {
    Login: async (call, callback) => {
        const { username, password } = call.request;
        try {
            const user = await User.findOne({ username });
            getUser = user;
            if (!user) {
                return callback(new Error("User not found"));
            }
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return callback(new Error("Invalid password"));
            }
            const metadata = new grpc.Metadata();
            metadata.add("userId", user._id.toString());
            return callback(null, { user });
        } catch (err) {
            return callback(err);
        }
    },
    SignUp: async (call, callback) => {
        const { username, password, name, gender } = call.request;

        try {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return callback(new Error("User already exists"));
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const profilePicture =
                gender === "male"
                    ? `https://avatar.iran.liara.run/public/boy?username=${username}`
                    : `https://avatar.iran.liara.run/public/girl?username=${username}`;

            const newUser = new User({
                username,
                name,
                password: hashedPassword,
                gender,
                profilePicture,
            });

            await newUser.save();

            return callback(null, { user: newUser });
        } catch (err) {
            return callback(err);
        }
    },
};
const transactionService = {
    CreateTransaction: async (call, callback) => {
        try {
            const input = call.request.transaction;

            const newTransaction = new Transaction({
                ...input,
                userId: getUser._id.toString(),
            });
            await newTransaction.save();
            callback(null, { transaction: newTransaction });
        } catch (err) {
            console.error("Error creating transaction:", err);
            callback(new Error("Error creating transaction"));
        }
    },

    GetTransaction: (call, callback) => {
        Transaction.findById(call.request.id)
            .then((transaction) => {
                callback(null, { transaction });
            })
            .catch((err) => callback(err));
    },
    UpdateTransaction: (call, callback) => {
        Transaction.findByIdAndUpdate(
            call.request.transaction.id,
            { ...call.request.transaction, userId: getUser._id.toString() },
            { new: true },
        )
            .then((updatedTransaction) =>
                callback(null, { transaction: updatedTransaction }),
            )
            .catch((err) => callback(err));
    },
    DeleteTransaction: (call, callback) => {
        Transaction.findByIdAndDelete(call.request.id)
            .then((deletedTransaction) =>
                callback(null, { message: "Transaction deleted successfully" }),
            )
            .catch((err) => callback(err));
    },
    ListTransactions: (call, callback) => {
        Transaction.find({})
            .then((transactions) => callback(null, { transactions }))
            .catch((err) => callback(err));
    },
};

const server = new grpc.Server();

server.addService(
    financeapp.AuthenticationService.service,
    authenticationService,
);
server.addService(financeapp.TransactionService.service, transactionService);

const port = 50051;

connectDB()
    .then(() => {
        console.log("Database connected successfully.");
        server.bindAsync(
            `0.0.0.0:${port}`,
            grpc.ServerCredentials.createInsecure(),
            () => {
                console.log(`gRPC server running at http://0.0.0.0:${port}`);
                server.start();
            },
        );
    })
    .catch((err) => {
        console.error("Failed to connect to the database:", err);
    });
