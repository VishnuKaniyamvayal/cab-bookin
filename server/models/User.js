import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    userType: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true,
        unique: true
    },
    gender: {
        type: String
    },
    mobile: {
        type: Number,
        require: true
    },
    photo: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        require: true,
        max: 50,
        unique: true
    },
    availableCoins: {
        type: Number,
        default:0
    },
    password: {
        type: String,
        require: true,
        min: 6
    },
    rating: {
        type: Number,
        default:0
    },
    isAvailable: {
        type: Boolean,
        default:true
    },
},
    {
        timestamps: true
    });

export default mongoose.model("User", UserSchema);