const Community = require("../models/Community");
const validator = require("validatorjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Member = require("../models/Member");
require("dotenv").config();
//
//********************************* */
//
// change id while creating to _id and when populating, change the name of _id to id
//
//******************************** 
//

exports.createCommunity = async (req,res) => {
    try {
        const {name} = req.body;
        // const {access_token} = req.cookies || req.header("Authorization").replace("Bearer ","");
        // if(!access_token){
        //     return res.status(400).json({
        //         status: false,
        //         errors: [
        //             {
        //                 param: access_token,
        //                 message: "Not signed in.",
        //                 code: "UNAUTHORISED_ACCESS"
        //             }
        //         ]
        //     })
        // }

        const {payload} = req.user;

        const data = {
            name,
          };
          const rules = {
            name:'required|min:2',
          }
          let validation = new validator(data,rules,{
            min:{
                string:'The :attribute be atleast :min characters.'
            }
        });

        if(validation.fails()){
            return res.status(400).json({
                status: false,
                errors: [
                    {
                        param: name,
                        message: "Name should be at least 2 characters.",
                        code: "INVALID_INPUT"
                    }
                ]
            })
        }
        const {id} = req.user;
        const generatedId = snowflake.generate().toString();
        const community = await Community.create({id:generatedId,name,slug:name.toLowerCase(),owner:id});

        //add member as communityadmin
        const communityAdmin = await Member.create({id:id,community:generatedId,role:"Community Admin"});

        return res.status(400).json({
            status: true,
            content: {
                data:community
            }
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            message: "ERROR: while creating community.",
            errorMessage: error.message,
          });
    }
};

exports.getAll = async (req,res)=>{
    try {
        const data = await Community.find({}).populate(owner).exec(); //************** */
        return res.status(200).json({
            status: true,
            content: {
                meta: {
                total: data.length,
                pages: Math.ceil(data.length/10),
                page: 1
                },
                data: data.slice(0,10)
        }
    })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "ERROR: while getting all communities.",
            errorMessage: error.message,
          });
    }
}

exports.getMembers = async (req,res) =>{
    try {
        const {id} = req.params;
        const data = await Member.find({community:id}); //**************************** populate only id and name*/
        return res.status(200).json({
            status: true,
            content: {
                meta: {
                total: data.length,
                pages: Math.ceil(data.length/10),
                page: 1
                },
                data:data.slice(0,10)
        }
    })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "ERROR: while getting all members.",
            errorMessage: error.message,
          });
    }
}

exports.getOwnedCommunity = async (req,res)=>{
    try {

        const id = req.user.data.id;

        const ownedCommunities = await Community.find({owner:id});
        
        res.status(200).json({
            status: true,
            content: {
                meta: {
                total: ownedCommunities.length,
                pages: Math.ceil(ownedCommunities.length/10),
                page: 1
                },
                data:ownedCommunities.slice(0,10)
        }
    })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "ERROR: while getting owned communities.",
            errorMessage: error.message,
          });
    }
}

exports.getJoinedCommunities = async(req,res)=>{
    try {
        
        const id = req.user.data.id;

        const joinedCommunities = await Member.find({user:id});

        res.status(200).json({
            status: true,
            content: {
                meta: {
                total: joinedCommunities.length,
                pages: Math.ceil(joinedCommunities.length/10),
                page: 1
                },
                data:joinedCommunities.slice(0,10)
        }
    })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "ERROR: while getting joined communities.",
            errorMessage: error.message,
          });
    }
}
