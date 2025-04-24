import express from "express";
import {
    createPaymentReceipt,
    getAllReceipts,
    updaterReceiptStatus,
    deleteReceipt

} from "../controllers/paymentReceiptsController.js"
import authMiddleware from "../middleware/authMiddleware.js"; // Import middleware

const router = express.Router();

// Protect the routes using the authMiddleware
router.post("/", authMiddleware, createPaymentReceipt);
router.get("/allreceipts", authMiddleware, getAllReceipts);
router.post("/delete", authMiddleware, deleteReceipt);
router.post("/status", authMiddleware, updaterReceiptStatus);


export default router;
