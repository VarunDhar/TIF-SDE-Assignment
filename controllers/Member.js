const Community = require("../models/Community");
const Member = require("../models/Member");
const Role = require("../models/Role");
const User = require("../models/User");
const snowflake = require("@theinternetfolks/snowflake");


exports.addMember = async (req,res)=>{
    try {
        
        const id = req.user.data.id;
        const {community,user,role} = req.body;

        const communityExist = await Community.findOne({_id:community});
        if(!communityExist){
            return res.status(400).json({
                status: false,
                    errors: [
                    {
                        param: "community",
                        message: "Community not found.",
                        code: "RESOURCE_NOT_FOUND"
                    }
                ]
            })
        }

        const roleExists = await Role.findOne({_id:role});
        if(!roleExists){
            return res.status(400).json({
                status: false,
                    errors: [
                    {
                        param: "role",
                        message: "Role not found.",
                        code: "RESOURCE_NOT_FOUND"
                    }
                ]
            })
        }

        const userExists = await User.findOne({_id:user});
        if(!userExists){
            return res.status(400).json({
                status: false,
                    errors: [
                    {
                        param: "user",
                        message: "User not found.",
                        code: "RESOURCE_NOT_FOUND"
                    }
                ]
            })
        }

        const admin = await Member.find({_id:id,community:community,role:"Community Admin"});
        if(!admin){
            return res.status(400).json({
                status: false,
                    errors: [
                    {
                        message: "You are not authorized to perform this action.",
                        code: "NOT_ALLOWED_ACCESS"
                    }
                ]
            })
        }

        const isPresent = await Member.findOne({_id:user, community:community});

        if(isPresent){
            return res.status(400).json({
                status: false,
                    errors: [
                    {
                        message: "User is already added in the community.",
                        code: "RESOURCE_EXISTS"
                    }
                ]
            })
        }

        const generatedId = snowflake.generate().toString();

        const addedMember  = await Member.create({_id:generatedId,user:user,role:role,community:community});


        return res.status(200).json({
            status: true,
            content: {
                data:addedMember
        }
    })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "ERROR: while adding member.",
            errorMessage: error.message,
          });
    }
}

exports.removeMember = async (req,res)=>{
    try {
        const removeId = req.params.id;
        const {id} = req.user.data;

        const adminRole = await Role.find({name:"Community Admin"});
        const modRole = await Role.find({name:"Community Moderator"});
        const ownedCommunities= await Member.find({user:id,role:{$in:[adminRole,modRole]}});


        if(ownedCommunities.length===0){
            return res.status(400).json({
                status: false,
                    errors: [
                    {
                        message: "You are not authorized to perform this action.",
                        code: "NOT_ALLOWED_ACCESS"
                    }
                ]
            })
        }

        ownedCommunities.map(async(p)=>{
            if((await Member.find({user:removeId,community:p.community})!==null)){
                return res.status(200).json({
                    status:true
                })
            }
        })

        return res.status(  200).json({
            status: false,
            errors: [
              {
                message: "Member not found.",
                code: "RESOURCE_NOT_FOUND"
              }
            ]
          })


    } catch (error) {
        res.status(500).json({
            status: false,
            message: "ERROR: while removing member.",
            errorMessage: error.message,
          });
    }
}