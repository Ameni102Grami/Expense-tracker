import express from "express";
import { all_users, user_delete, user_update } from "../controllers/user.js";

const router = express.Router();

router.get("/", all_users);
router.delete("/:userId", user_delete);
router.put("/:userId", user_update);

export default router;
