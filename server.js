/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const utilities = require("./utilities/")
const session = require("express-session")
const pool = require("./database/")
const generalRoute = require("./routes/generalRoute")
// const contactRoute = require("./routes/messageRoute")
// const accountRoute = require("./routes/accountRoute")
// const menuRoute = require("./routes/menuRoute")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

/* ***********************
 * Middleware
 *************************/
app.use(session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: 'sessionId',
  }))

// Express Messages Middleware
app.use(require("connect-flash")())
app.use(function(req, res, next){
  res.locals.messages = require("express-messages")(req, res)
  next()
})

// Body Parser Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true})) // for parsing application/x-www-form-urlencoded

// Cookie Parser Middleware
app.use(cookieParser())

// Check token
app.use(utilities.checkJWTToken)

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)
// Index route
app.get("/", generalRoute)

// // Contact Route
// app.use("/contact", contactRoute)

// // Account Route
// app.use("/account", accountRoute)

// About Route
app.get("/about", generalRoute)

// // Menu Route
// app.use("/menu", menuRoute)

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
    next({status: 404, message: 'Oh No! You found our secret vacation plans.'})
  })
  

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
    console.error(`Error at: "${req.originalUrl}": ${err.message}`)
    if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
    res.render("errors/error", {
      title: err.status || 'Server Error',
      link: err.link || '/',
      message,
    })
  })

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on http://${host}:${port}`)
})