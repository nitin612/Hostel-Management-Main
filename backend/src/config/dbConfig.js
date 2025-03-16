import mongoose from "mongoose";

const connectDb = async () => {
   try {
      await mongoose.connect(process.env.CONNECTION_STRING, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
      });
      console.log("✅ Database Connected Successfully!");
   } catch (e) {
      console.error("❌ Database connection error:", e.message);
      process.exit(1); // Exit the app on failure
   }
};

export { connectDb };
