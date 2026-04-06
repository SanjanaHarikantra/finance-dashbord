const router = require("express").Router();
const {
  listRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord
} = require("../controllers/recordController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);

router.route("/")
  .get(authorize("admin", "analyst"), listRecords)
  .post(authorize("admin"), createRecord);

router.route("/:id")
  .get(authorize("admin", "analyst"), getRecordById)
  .patch(authorize("admin"), updateRecord)
  .delete(authorize("admin"), deleteRecord);

module.exports = router;
