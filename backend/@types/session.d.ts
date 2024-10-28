//! This connects some MongoDB information to the actual user session
import mongoose from "mongoose";

declare module "express-session" {
    interface SessionData {
        userId: mongoose.Types.ObjectId | string | null;
    }
}