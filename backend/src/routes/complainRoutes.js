import express from "express";
import {
    createComplaint,
    getAllComplaints,
    updateComplainStatus,
    deleteComplaint

} from "../controllers/complainController.js"
import authMiddleware from "../middleware/authMiddleware.js"; // Import middleware

const router = express.Router();

// Protect the routes using the authMiddleware
router.post("/", authMiddleware, createComplaint);
router.get("/allcomplains", authMiddleware, getAllComplaints);
router.post("/delete", authMiddleware, deleteComplaint);
router.post("/status", authMiddleware, updateComplainStatus);
// router.get("/accepted", authMiddleware, getAcceptedRoomRequests);
// router.get("/user/:userId", authMiddleware, getUserRequests);

export default router;
