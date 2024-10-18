// Needed Resources 
const express = require("express")
const router = new express.Router() 
const baseController = require("../controllers/baseController")
const util = require("../utilities")

// Routes

// Default Home Route
router.get("/", util.handleErrors(baseController.buildHome))

// Default About Route
router.get("/about", util.handleErrors(baseController.buildAbout))

// Export
module.exports = router