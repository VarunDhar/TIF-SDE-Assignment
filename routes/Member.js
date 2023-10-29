const express = require("express")
const router = express.Router()

const {addMember,
    removeMember} = require("../controllers/Member");

router.post("/",addMember);
router.delete("/:id",removeMember);

module.exports = router;