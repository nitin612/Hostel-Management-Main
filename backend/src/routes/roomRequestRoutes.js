import express from "express";
import { 
    createRoomRequest, 
    getPendingRequests, 
    updateRoomRequest, 
    getUserRequests,
    getAllRoomRequests  
} from "../controllers/roomRequestControler.js";

const router = express.Router();

// User submits room request
router.post("/", createRoomRequest);

// Admin fetches pending requests
router.get("/admin", getPendingRequests);

// Admin updates request status
router.put("/:id", updateRoomRequest);

// ✅ Ensure this route is above `/user/:userId`
// router.get('/room-requests', getAllRoomRequests);
router.get("/", getAllRoomRequests);


// User fetches their requests
router.get("/user/:userId", getUserRequests);

export default router;
