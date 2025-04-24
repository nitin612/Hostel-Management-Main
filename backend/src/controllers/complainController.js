import Complain from "../models/ComplainModal.js";

export const createComplaint = async (req, res) => {
  const { title, description,img} = req.body;
  const userId = req.user.id; // Extract from token using middleware

  if (!title || !description) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const complain = new Complain({
      title,
      image:img?img:"",
      description,
    });

    await complain.save();
    res.status(201).json({
      message: "Complain submitted successfully!",
      requestDetails: complain,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getAllComplaints = async (req, res) => {
  try {
    const request = await Complain.find({});
    res.status(200).json({
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.body;
    const request = await Complain.findOneAndDelete(id);
    res.status(200).json({
      message: "Complain has been deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateComplainStatus = async (req, res) => {
    try {
      const { id, status } = req.body;
  
      // Update the status of the Complain document
      const updatedComplain = await Complain.findByIdAndUpdate(
        id,
        { status },
        { new: true } // return the updated document
      );
  
      if (!updatedComplain) {
        return res.status(404).json({ message: "Complain not found" });
      }
  
      res.status(200).json({
        message: "Complain status updated successfully",
        data: updatedComplain,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  