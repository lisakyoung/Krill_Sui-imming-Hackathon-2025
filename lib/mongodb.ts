import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoURI: string = process.env.DB || "";

// db 연결
export const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB가 연결되었습니다.");
  } catch (err) {
    console.error("MongoDB가 연결되지 않았습니다.", err);
    process.exit(1);
  }
};

const creatorSchema = new mongoose.Schema({
    address: {
        type: String
    },
    manager: {
        type: String
    }
})

export const Creator = mongoose.model('Creator', creatorSchema);