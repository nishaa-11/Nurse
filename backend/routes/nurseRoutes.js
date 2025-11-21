const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { listNurses, getNurse, updateNurse, verifyNurse } = require("../controllers/nurseController");

router.get("/",  listNurses);
router.get("/:id",  getNurse);
router.put("/:id",  updateNurse);
router.post("/:id/verify",  verifyNurse);

module.exports = router;
