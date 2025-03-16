import RoomRequest from "../models/roomRequestModel.js";

// 🏠 Create a new room request
export const createRoomRequest = async (req, res) => {
    try {
        const { userId, faculty, batch, members, reason } = req.body;
        const newRequest = new RoomRequest({ userId, faculty, batch, members, reason, status: "pending" });

        await newRequest.save();
        res.status(201).json({ message: "Room request submitted successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Server error: " + error.message });
    }
};

// ✅ Admin approves/rejects the request
export const updateRoomRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // "accepted" or "rejected"

        const request = await RoomRequest.findById(id);
        if (!request) return res.status(404).json({ message: "Request not found" });

        request.status = status;
        await request.save();

        res.status(200).json({ message: `Request ${status.toLowerCase()} successfully!` });
    } catch (error) {
        res.status(500).json({ error: "Server error: " + error.message });
    }
};

// 🏠 Get all pending requests (for Admin)
export const getPendingRequests = async (req, res) => {
    try {
        const pendingRequests = await RoomRequest.find({ status: "pending" });
        res.status(200).json(pendingRequests);
    } catch (error) {
        res.status(500).json({ error: "Server error: " + error.message });
    }
};

// ✅ Get user's room requests
export const getUserRequests = async (req, res) => {
    try {
        const { userId } = req.params;
        const userRequests = await RoomRequest.find({ userId });
        res.status(200).json(userRequests);
    } catch (error) {
        res.status(500).json({ error: "Server error: " + error.message });
    }
};

export const getAllRoomRequests = async (req, res) => {
  try {
      const requests = await RoomRequest.find();
      res.status(200).json(requests);
  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
};
