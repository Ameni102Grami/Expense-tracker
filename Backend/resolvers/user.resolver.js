import { users } from "./../dummyData/data.js";

const userResolver = {
    Query: {
        users: (_, t, { req, res }) => {
            return users;
        },

        user: (_, { userId }) => {
            return users.find((el) => el._id == userId);
        },
    },
    Mutation: {},
};

export default userResolver;
