const { query } = require('express-validator');
const accountModel = require('../models/accountModel');


const { body, validationResult } = require('express-validator');
const { link } = require('../routes/static');
const validate = {}

/* *************************************
* Registration Data Validation Rules
************************************** */
validate.registrationRules = () => {
    // console.log('Registration Rules')
    return [
        // firstname is required and must be a string
        body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.

        // lastname is required and must be a string
        body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.

        // valid email is required and cannot already exist in the database
        body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
            const emailExists = await accountModel.checkExistingEmail(account_email)
            if (emailExists){
                throw new Error("Email already exists. Please login or use a different email.")
            }
        }),

        // password is required and must be a strong password
        body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage("Password does not meet requirements.")
    ]
}


/* *********************************************************
* Check data and return errors or continue to registration
********************************************************** */
validate.checkRegData = async (req, res, next) => {
    console.log('Check Reg Data')
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log('Issue with registration data')
        res.render("account/register", {
            errors,
            title: "Register",
            link: "register",
            // section: "account",
            account_firstname,
            account_lastname,
            account_email
        })
        return
    }
    next()
}

/* *************************************
* Login Data Validation Rules
************************************** */
validate.loginRules = () => {
    return [
        // email is required and must be a valid email
        body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage("A valid email is required."),

        // password is required
        body("account_password")
        .trim()
        .notEmpty()
        .withMessage("Password is required.")
    ]
}

/* *************************************
* Check data and return errors or continue to login
************************************** */
validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    // console.log(account_email)
    // console.log('Check Login Data')
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.render("account/login", {
            errors,
            title: "Login",
            link: "login",
            section: "account",
            url: "/account/login",
            account_email
        })
        return
    }
    next()
}

/* *************************************
* Update Account Data Validation Rules
************************************** */

validate.updateAccountRules = () => {
    return [
        // firstname is required and must be a string
        body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("First Name is required.") // on error this message is sent.
        .isLength({ min: 1 })
        .withMessage("Length must be greater than 1."), // on error this message is sent.

        // lastname is required and must be a string
        body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Last Name is required.") // on error this message is sent.
        .isLength({ min: 2 })
        .withMessage("Last Name must be at least two characters long."), // on error this message is sent.

        // valid email is required and cannot already exist in the database
        body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (account_email, {req}) => {
            const account_id = req.body.account_id
            const account = await accountModel.getAccountById(account_id)
            // Check if submitted email is same as existing
            if (account_email != account.account_email) {
                // No - Check if email exists in table
                const emailExists = await accountModel.checkExistingEmail(account_email)
                // Yes - throw error
                console.log(emailExists)
                if (emailExists != 0) {
                    throw new Error("Email exists. Please use a different email")
                }
            }
        })
        
    ]
}

/* *************************************
* Check data and return errors or continue to update
************************************** */
validate.checkUpdateData = async (req, res, next) => {
    let errors = validationResult(req)
    const { account_firstname, account_lastname, account_email, account_id } = req.body
    if (!errors.isEmpty()) {
        res.render("account/updateAccount", {
            errors,
            title: "Update Account",
            section: "account",
            link: "update",
            user: res.locals.accountData,
            account_firstname,
            account_lastname,
            account_email,
            account_id
        })
        return
    }
    next()
}

/* *************************************
* Update Password Data Validation Rules
************************************** */

validate.updatePasswordRules = () => {
    return [
        // password is required and must be a strong password
        body("account_password")
        .trim()
        .notEmpty()
        .withMessage("Password is required.")
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage("Password does not meet requirements:")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long.")
        .isLowercase({ min: 1 })
        .withMessage("Password must contain at least one lowercase letter.")
        .isUppercase({ min: 1 })
        .withMessage("Password must contain at least one uppercase letter.")
        .isNumeric({ min: 1 })
        .withMessage("Password must contain at least one number.")
        .isStrongPassword()
        .withMessage("Password must contain at least one special character.")
    ]
}

/* *************************************
* Check data and return errors or continue to update
************************************** */
validate.checkUpdatePassword = async (req, res, next) => {
    let errors = validationResult(req)
    const { account_id } = req.body
    const account = await accountModel.getAccountById(account_id)
    if (!errors.isEmpty()) {
        res.render("account/updateAccount", {
            errors,
            title: "Update Account Information",
            section: "account",
            link: "account/updateAccount",
            user: res.locals.accountData,
            account_firstname: account.account_firstname,
            account_lastname: account.account_lastname,
            account_email: account.account_email,
            account_id: account.account_id
        })
        return
    }
    next()
}


module.exports = validate