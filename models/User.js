import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        require: true,
    },
    avtarUrl: String,
  }, 
  {
    timestamps: true,
  },
);

export default mongoose.model('User', UserSchema);