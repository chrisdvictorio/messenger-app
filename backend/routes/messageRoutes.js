import express from "express";

import protectRoute from "../middlewares/protectRoute.js";
import {
  sendMessage,
  getAllMessages,
  getAllGroupMessages,
  sendGroupMessage,
  getAllUserImagesSent,
} from "../controllers/messageController.js";

const router = express.Router();

router.get("/:id", protectRoute, getAllMessages);
router.get("/groups/:id", protectRoute, getAllGroupMessages);
router.get("/images/sent", protectRoute, getAllUserImagesSent);
router.post("/", protectRoute, sendMessage);
router.post("/groups/:id/send", protectRoute, sendGroupMessage);

export default router;
