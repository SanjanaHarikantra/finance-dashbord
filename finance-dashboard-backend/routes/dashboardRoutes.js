const router = require("express").Router();
const { getDashboardSummary } = require("../controllers/dashboardController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/summary", protect, authorize("viewer", "analyst", "admin"), getDashboardSummary);

module.exports = router;
