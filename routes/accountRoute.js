// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const util = require("../utilities")

// Routes

// Default register Route
router.get("/register", util.handleErrors(accountController.buildRegister))

// Default myAccount Route
router.get("/myAccount", util.handleErrors(accountController.buildMyAccount))

// Account Schedule Route
router.get("/schedule", util.handleErrors(accountController.buildSchedule))

module.exports = router