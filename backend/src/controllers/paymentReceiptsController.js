import Receipt from "../models/paymentReceiptModal.js";

export const createPaymentReceipt = async (req, res) => {
  const { reason, amount,image} = req.body;
  const userId = req.user.id; // Extract from token using middleware

  if (!reason || !amount) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const receipt = new Receipt({
      userId,
      title:reason,
      image:image?image:"",
      description:amount,
    });

    await receipt.save();
    res.status(201).json({
      message: "Receipt submitted successfully!",
      requestDetails: receipt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getAllReceipts = async (req, res) => {
  try {
    const request = await Receipt.find({}).populate('userId');
    console.log(request,"dasds")
    res.status(200).json({
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteReceipt = async (req, res) => {
  try {
    const { id } = req.body;
    const request = await Receipt.findOneAndDelete(id);
    res.status(200).json({
      message: "Receipt has been deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updaterReceiptStatus = async (req, res) => {
    try {
      const { id, status } = req.body;
  
      const updatedReceipt = await Receipt.findByIdAndUpdate(
        id,
        { status },
        { new: true } // return the updated document
      );
  
      if (!updatedReceipt) {
        return res.status(404).json({ message: "Receipt not found" });
      }
  
      res.status(200).json({
        message: "Receipt status updated successfully",
        data: updatedComplain,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  