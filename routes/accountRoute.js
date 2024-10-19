// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const accountValidator = require("../utilities/accountValidation")
const util = require("../utilities")

// Routes

// Default register Route
router.get("/register", util.handleErrors(accountController.buildRegister))

// Register POST route
router.post("/register",
    accountValidator.registrationRules(),
    accountValidator.checkRegData, 
    util.handleErrors(accountController.registerAccount))

// Default myAccount Route
router.get("/", util.checkLogin, util.handleErrors(accountController.buildMyAccount))

// Account Schedule Route
router.get("/schedule", util.checkLogin, util.handleErrors(accountController.buildSchedule))

// Data Input Route
router.get("/course", util.checkLogin, util.handleErrors(accountController.buildData))

// Data POST Route
router.post("/data", util.handleErrors(accountController.addCourses))

// Account Login POST Route
router.post("/login", util.handleErrors(accountController.accountLogin))

// Logout Route
router.get('/logout', accountController.accountLogout)

// Practice route
router.get("/practice", util.handleErrors(accountController.practice))

// Assignment Route
router.get("/assignment", util.checkLogin, util.handleErrors(accountController.buildAssignment))

// Assignment POST Route
router.post("/assignment", util.handleErrors(accountController.addAssignment))

// Study Time Route
router.get("/study", util.checkLogin, util.handleErrors(accountController.buildStudy))

// Study Time POST Route
router.post("/study", util.handleErrors(accountController.addStudy))

module.exports = router