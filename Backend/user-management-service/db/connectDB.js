import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        console.log("hhh", process.env.MONGO_URI);
        const conn = await mongoose.connect(
            "mongodb+srv://amenigrami489:gGtrT44bCULoEwYK@cluster0.oxcyx6j.mongodb.net/gql-db?retryWrites=true&w=majority",
        );
        console.log("im connected to DB", conn.connection.host);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
