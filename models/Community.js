const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema({

    name:{
        type:String,
    },
    slug:{
        type:String
    },
    owner:{
        type:String,
        ref:"User"
    },
    created_at:{
        type:String,
        default:Date.now()
    },
    updated_at:{
        type:String,
        default:Date.now()
    }

    
})

module.exports = mongoose.model("Community",communitySchema);
