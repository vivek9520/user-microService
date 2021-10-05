const { Router } = require("express");

const userController = require("../controllers/userController");

// const { givePermissions } = require("./../middlewares/permissionMiddleware");

const router = Router();

router.get("/api/v1/users", userController.users_get);
router.get("/api/v1/users/:id", userController.users_get_byID);
router.put("/api/v1/users/:id", userController.userUpdate);

module.exports = router;
