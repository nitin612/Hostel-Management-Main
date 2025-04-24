import RoomRequest from "../models/roomRequestModel.js";
import mongoose from "mongoose";

//  Create a new room request
export const createRoomRequest = async (req, res) => {
    const { faculty, batch, members, reason } = req.body;
    const userId = req.user.id; // Extract from token using middleware
  
    if (!faculty || !batch || !reason) {
      return res.status(400).json({ message: "All fields are required." });
    }
  
    try {
      const roomRequest = new RoomRequest({
        userId,
        faculty,
        batch,
        members,
        reason,
        status: "pending",
      });
  
      await roomRequest.save();
      res.status(201).json({ message: "Room request submitted successfully!" ,requestDetails:roomRequest});
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
// Admin approves/rejects the request
export const updateRoomRequest = async (req, res) => {
  try {
    const { id, status, adminResponse } = req.body; // Status can be 'accepted' or 'rejected'

    const request = await RoomRequest.findById(id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = status;
    if (status !="decline" && adminResponse) request.adminResponse = adminResponse;
    await request.save();

    res.status(200).json({ message: `Request ${status.toLowerCase()} successfully!`, request });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};
export const updateRoomDetails = async (req, res) => {
  try {
    const { id, furnitureDetails } = req.body; // Status can be 'accepted' or 'rejected'

    const request = await RoomRequest.findById(id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (furnitureDetails) request.furnitureDetails = furnitureDetails
    await request.save();

    res.status(200).json({ message: `Request updated successfully!`,request });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

// 🏠 Get all pending requests (for Admin)
export const getPendingRequests = async (req, res) => {
    try {
        const pendingRequests = await RoomRequest.find({ status: "pending" }).populate('userId');
        res.status(200).json(pendingRequests);
    } catch (error) {
        res.status(500).json({ error: "Server error: " + error.message });
    }
};
export const getAllRequest = async (req, res) => {
    try {
        const pendingRequests = await RoomRequest.find({  }).populate('userId');
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

export const getAcceptedRoomRequests = async (req, res) => {
  try {
    const requests = await RoomRequest.find({ status: "accepted" }).populate('userId');
      res.status(200).json(requests);
  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
};
