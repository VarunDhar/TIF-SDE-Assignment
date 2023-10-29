const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    id:{
        type:String
    },
    name:{
        type:String,
        require:true,
        default:null
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

module.exports = mongoose.model("Role",roleSchema);
