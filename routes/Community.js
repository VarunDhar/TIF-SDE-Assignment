const express = require("express")
const router = express.Router()

const {createCommunity,
    getAll,
    getMembers,
    getOwnedCommunity,
    getJoinedCommunities} = require("../controllers/Community");

router.post("/",createCommunity);
router.get("/",getAll);
router.get("/:id/members",getMembers);
router.get("/me/owner",getOwnedCommunity);
router.get("/me/member",getJoinedCommunities);


module.exports = router;