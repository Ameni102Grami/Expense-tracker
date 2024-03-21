import User from "../../models/user.model.js";

export const user_delete = (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then((result) => {
            res.status(200).json({ message: "User deleted" });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

export const user_update = (req, res, next) => {
    User.update({ name: req.body.name, phoneNumber: req.body.phoneNumber })
        .exec()
        .then((result) => {
            res.status(200).json({ message: "User updated" });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

export const all_users = (req, res, next) => {
    User.find({})
        .exec()
        .then((result) => {
            res.status(200).json({ result });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};
