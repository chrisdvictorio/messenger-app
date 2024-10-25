import express from "express";

import protectRoute from "../middlewares/protectRoute.js";
import {
  acceptFriendRequest,
  declineFriendRequest,
  getAllUsers,
  updateProfile,
  sendFriendRequest,
  cancelFriendRequest,
  removeFriend,
  getUserProfile,
  getUserLastActive,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", protectRoute, getAllUsers);
router.get("/:id", protectRoute, getUserProfile);
router.get("/last-active/:id", protectRoute, getUserLastActive);
router.patch("/update", protectRoute, updateProfile);
router.post("/:id/friend-request", protectRoute, sendFriendRequest);
router.post("/:id/friend-request/accept", protectRoute, acceptFriendRequest);
router.delete(
  "/:id/friend-request/decline",
  protectRoute,
  declineFriendRequest
);
router.delete("/:id/friend-request/cancel", protectRoute, cancelFriendRequest);
router.delete("/friends/:id/remove", protectRoute, removeFriend);

export default router;
