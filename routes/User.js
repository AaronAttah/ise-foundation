const express =  require("express")
const controller = require("../controller")



const userRoutes = express.Router()
const {authMiddleware, } = require("../middlewares/authMiddleware")

userRoutes.post("/", controller.users.createUser)
userRoutes.post("/login", controller.users.login)
userRoutes.get("/:id",authMiddleware, controller.users.getUser)
userRoutes.put("/:id",authMiddleware, controller.users.updateUser)
userRoutes.delete("/:id",authMiddleware, controller.users.deleteUser)

module.exports = userRoutes
