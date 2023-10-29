const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
    community:{
        type:String,
        require:true,
        default:null
    },
    user:{
        type:String,
        ref:"User",
        require:true
    },
    role:{
        type:String,
        ref:"Role",
        require:true
    },
    created_at:{
        type:String,
        default:Date.now()
    },
})

module.exports = mongoose.model("Member",memberSchema);
