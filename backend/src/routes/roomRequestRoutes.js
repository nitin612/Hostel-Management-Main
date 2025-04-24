import express from "express";
import { 
  createRoomRequest, 
  getPendingRequests, 
  updateRoomRequest, 
  getUserRequests, 
  getAcceptedRoomRequests,
  updateRoomDetails,
  getAllRequest
} from "../controllers/roomRequestControler.js";
import authMiddleware from "../middleware/authMiddleware.js"; // Import middleware

const router = express.Router();

// Protect the routes using the authMiddleware
router.post("/", authMiddleware, createRoomRequest);
router.get("/admin", authMiddleware, getPendingRequests);
router.put("/approval", authMiddleware, updateRoomRequest);
router.get("/all", authMiddleware, getAllRequest);
router.put("/update", authMiddleware, updateRoomDetails);
router.get("/accepted", authMiddleware, getAcceptedRoomRequests);
router.get("/user/:userId", authMiddleware, getUserRequests);

export default router;
