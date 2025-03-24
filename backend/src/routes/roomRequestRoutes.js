import express from "express";
import { 
  createRoomRequest, 
  getPendingRequests, 
  updateRoomRequest, 
  getUserRequests, 
  getAllRoomRequests 
} from "../controllers/roomRequestControler.js";
import authMiddleware from "../middleware/authMiddleware.js"; // Import middleware

const router = express.Router();

// Protect the routes using the authMiddleware
router.post("/", authMiddleware, createRoomRequest);
router.get("/admin", authMiddleware, getPendingRequests);
router.put("/approval", authMiddleware, updateRoomRequest);
router.get("/", authMiddleware, getAllRoomRequests);
router.get("/user/:userId", authMiddleware, getUserRequests);

export default router;
