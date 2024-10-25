import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import {
  changeGroupPicture,
  changeGroupName,
  createGroup,
  getAllChat,
  getAllGroups,
  leaveGroup,
  removeGroupMember,
  deleteGroupChat,
} from "../controllers/chatController.js";

const router = express.Router();

router.get("/", protectRoute, getAllChat);
router.get("/groups", protectRoute, getAllGroups);
router.post("/groups/create", protectRoute, createGroup);
router.patch("/groups/:id", protectRoute, changeGroupName);
router.patch("/groups/:id/picture", protectRoute, changeGroupPicture);
router.patch("/groups/:id/leave", protectRoute, leaveGroup);
router.delete(
  "/groups/:chatId/remove-member/:userIdToRemove",
  protectRoute,
  removeGroupMember
);
router.delete("/groups/:id/delete", protectRoute, deleteGroupChat);

export default router;
