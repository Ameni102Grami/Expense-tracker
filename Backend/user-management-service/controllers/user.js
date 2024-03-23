import User from "./../models/user.model.js";

export const user_delete = (req, res, next) => {
    User.remove({ _id: req.params.userId })

        .then((result) => {
            res.status(200).json({ message: "User deleted" });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

export const user_update = (req, res, next) => {
    const userId = req.params.userId;
    const updateData = req.body; // Assuming the updated data is sent in the request body
    User.findByIdAndUpdate(userId, updateData)
        .then((result) => {
            if (!result) {
                return res.status(404).json({ error: "User not found" });
            }
            res.status(200).json({ message: "User updated" });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "Internal Server Error" });
        });
};

export const all_users = (req, res, next) => {
    console.log({ res });
    User.find({})
        .then((users) => {
            res.status(200).json({ users });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "Internal Server Error" });
        });
};
