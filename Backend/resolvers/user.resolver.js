import User from "../models/user.model.js";
import { users } from "./../dummyData/data.js";
import bcrypt from "bcryptjs";

const userResolver = {
    Mutation: {
        signUp: async (_, { input }, context) => {
            try {
                const { username, name, password, gender } = input;
                if (!username || !name || !password || !gender) {
                    throw new Error("All fields are required");
                }
                const existingUser = await User.findOne({ username });
                if (existingUser) {
                    throw new Error("User Already Exists");
                }
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                const boyProfilePic = `https://avatar.iran.liara.run/public/boy?${username}`;
                const girlProfilePic = `https://avatar.iran.liara.run/public/girl?${username}`;
                const newUser = new User({
                    username,
                    name,
                    password: hashedPassword,
                    gender,
                    profilePicture:
                        gender === "male" ? boyProfilePic : girlProfilePic,
                });
                await newUser.save();
                await context.login(newUser);
                return newUser;
            } catch (err) {
                console.log("Error in signup ", err);
                throw new Error(err.message || "internal server error");
            }
        },

        login: async (_, { input }, context) => {
            try {
                const { username, password } = input;
                const { user } = await context.authenticate("graphql-local", {
                    username,
                    password,
                });
                await context.login(user);
                return user;
            } catch (err) {
                console.log("Error in login ", err);
                throw new Error(err.message || "internal server error");
            }
        },

        logout: async (_, t, context) => {
            try {
                await context.logout();
                req.session.destroy((err) => {
                    if (err) throw err;
                });
                res.clearCookie();
                return { message: "logged out successfully" };
            } catch (err) {
                console.log("Error in logout ", err);
                throw new Error(err.message || "internal server error");
            }
        },
    },
    Query: {
        authUser: async (_, t, context) => {
            try {
                const user = context.getUser();
                return user;
            } catch (err) {
                console.log("Error in auth user ", err);
                throw new Error(err.message || "internal server error");
            }
        },
        user: async (_, { userId }) => {
            try {
                const user = User.findById(userId);
                return user;
            } catch (err) {
                console.log("Error user query ", err);
                throw new Error(err.message || "internal server error");
            }
        },
    },
};

export default userResolver;
