import Annoucement from "../models/announcementModal.js";

export const createAnnouncement = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id; // Extract from token using middleware

  if (!title || !description) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const Announcement = new Annoucement({
      title,
      description,
    });

    await Announcement.save();
    res.status(201).json({
      message: "Announcement submitted successfully!",
      requestDetails: Announcement,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getAllAnnouncements = async (req, res) => {
  try {
    const request = await Annoucement.find({});
    res.status(200).json({
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteAnnouncements = async (req, res) => {
  try {
    const { id } = req.body;
    const request = await Annoucement.findOneAndDelete(id);
    res.status(200).json({
      message: "Announcement has been deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
