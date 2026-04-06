const router = require("express").Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect, authorize("admin"));

router.route("/")
  .get(getUsers)
  .post(createUser);

router.route("/:id")
  .get(getUserById)
  .patch(updateUser);

module.exports = router;
