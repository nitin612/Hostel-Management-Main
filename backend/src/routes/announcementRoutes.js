import express from "express";
import {
  createAnnouncement,
  deleteAnnouncements,
  getAllAnnouncements,
} from "../controllers/announcementController.js";
import authMiddleware from "../middleware/authMiddleware.js"; // Import middleware

const router = express.Router();

// Protect the routes using the authMiddleware
router.post("/", authMiddleware, createAnnouncement);
router.get("/allannouncements", authMiddleware, getAllAnnouncements);
router.post("/delete", authMiddleware, deleteAnnouncements);
// router.get("/accepted", authMiddleware, getAcceptedRoomRequests);
// router.get("/user/:userId", authMiddleware, getUserRequests);

export default router;
