import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    user:{
        type: mongoose.Types.ObjectId,
        require:true,
        ref: 'User' 
    },
    origin:{
        type:Object,
        require:true
    },
    destination:{
        type:Object,
        require:true
    },
    plan:{
        type:Object,
        require:true
    },
    assignedTo:{
        type:mongoose.Types.ObjectId,
        require:true,
        ref: 'Driver'
    },
    isProgress:{
        type:Boolean,
        default:true,
    },
    price:{
        type:Number,
        require:true
    },
},
    {
        timestamps: true
    });

export default mongoose.model("Ride", UserSchema);