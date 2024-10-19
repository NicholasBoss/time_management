const accountModel = require('../models/accountModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { link } = require('../routes/static')
const e = require('connect-flash')
const env = require("dotenv").config()
require('dotenv').config()

async function buildRegister(req, res) {
    res.render("account/register", {
        title: "Register",
        link: "register",
        errors: null,
    })
}

async function buildMyAccount(req, res){
    // get account data
    

    res.render("account/myAccount", {
        title: "My Account",
        link: "myAccount",
        errors: null,
        accountData: res.locals.accountData,
    })
}

async function buildSchedule(req, res) {
    const account_id = res.locals.accountData.account_id
    let schedule = await accountModel.getSchedule(account_id)
    console.log('ACCOUNT ID:', account_id)
    // if schedule is empty, redirect to courses page and inform user to add courses, 
    if (schedule.length < 1) {
        req.flash('error', 'You have no courses scheduled. Please add courses to your schedule.')
        res.redirect('/account')
    } else {
        schedule = schedule[0]
        console.log('SCHEDULE BEFORE PAGE RENDER', schedule)
        res.render("account/schedule", {
            title: "My Schedule",
            link: "schedule",
            errors: null,
            schedule
        })
    }
}

/* ********************
 * Data Input
**********************/
async function buildData(req, res){
    res.render("account/courses", {
        title: "Data",
        link: "account/course",
        errors: null,
    })
}

/* ***********************
 * Register User
 *************************/
async function registerAccount(req, res){
    console.log('Registering account')
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    console.log('Account First Name:', account_firstname)
    console.log('Account Last Name:', account_lastname)
    console.log('Account Email:', account_email)
    let hashedPassword
    try {
        console.log('Creating account')
        hashedPassword = await bcrypt.hash(account_password, 10)
    } catch (error) {
        console.log('Error creating account')
        res.render("account/register", {
            title: "Register",
            link: "register",
            section: "account",
            errors: error.errors
        })
    }

    const regResult = await accountModel.createAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword,
    )

    if (regResult) {
        req.flash(
            'notice', 
            `Congratulations, you\'re now registered ${account_firstname}. Please log in.`
        )
        res.status(201).render('index', {
            title: 'Login',
            link: '',
            section: 'account',
            errors: null,
            url: '/account/register'
        })
    } else {
        req.flash(
            'notice', 
            `Sorry the registration failed.`
        )
        res.status(501).render('/register', {
            title: 'Register',
            link: 'register',
            section: 'account',
            errors: null,
        })
    }
}

/* *********************
 * Process Login
************************/
async function accountLogin(req, res){
    const { account_email, account_password } = req.body
    // console.log('URL:', url)
    const accountData = await accountModel.getAccountByEmail(account_email)
    // console.log("Account Data")
    // console.log(accountData)
    if (!accountData) {
        req.flash('notice', 'Please check your credentials and try again.')
        res.status(400).render('index', {
            title: 'Login',
            link: '',
            section: 'account',
            errors: null,
            account_email
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)){
            delete accountData.account_password
            console.log('Assigning JWT')
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600})
            if(process.env.NODE_ENV === 'development'){
                res.cookie('jwt', accessToken, {httpOnly: true, maxAge: 3600 * 1000})
        } else {
            res.cookie('jwt', accessToken, {httpOnly: true, secure: true, maxAge: 3600 * 1000})
        }
        
        // const newUrl = url
        // console.log('URL:', url)
        // if (newUrl == 'index' || newUrl == '/account/register') {
            res.redirect('/account/')
        // } else {
        //     res.redirect(newUrl)
        // }
    } else {
        req.flash('notice', 'Please check your credentials and try again.')
        res.status(400).render('index', {
            title: 'Login',
            link: '',
            section: 'account',
            errors: null,
            account_email,
            // url
        })
    
    }
} catch (error) {
    return new Error('Access Forbidden')
}
}

/* *******************************
 * Process Logout
*********************************/
async function accountLogout(req, res){
    res.clearCookie('jwt')
    req.flash('notice', 'You have been logged out.')
    res.redirect('/')
}

// Temp Practice route
async function practice(req, res){
    const account_id = res.locals.accountData.account_id
    const schedule = await accountModel.getSchedule(account_id)
    res.render('account/practice', {
        title: 'Practice',
        link: 'practice',
        errors: null,
        schedule
    })
}

/* **********************
 * Add Drops
***********************/
async function addCourses(req, res){
    try {
        const {course_name, course_credit_amount, course_day_selection, course_start_time, course_end_time, account_id} = req.body
        console.log('Course Name:', course_name)
        console.log('Course Credit:', course_credit_amount)
        console.log('Course Day Selection:', course_day_selection)
        console.log(typeof course_day_selection)
        // if course_day_selection only has one item, don't join it,
        
        let course_day_selection_list
        if (typeof course_day_selection === 'object') {
            course_day_selection_list = course_day_selection.join(',')
        } else {
            course_day_selection_list = course_day_selection
        }
        console.log('Course Day Selection:', course_day_selection_list)
        console.log('Course Start Time:', course_start_time)
        console.log('Course End Time:', course_end_time)
        console.log('Account ID:', account_id)


        // Filter out empty drops (0 max quantity)
        // drops = drops.filter(drop => drop.drop_max_quantity > 0)
        // console.log('Filtered Drops:', drops)

        let addCourse = await accountModel.addCourse(course_name, parseInt(course_credit_amount), course_day_selection_list, course_start_time, course_end_time, account_id)
        // When all drops are added, redirect to admin page
        if (addCourse) {
            
                req.flash('notice', 'Course Added Successfully')
                res.redirect('/account/course')

        } else {
            req.flash('error', 'Error adding Course')
            res.render('/account/data', {
                title: 'Data',
                link: 'account/data',
                section: 'account',
                errors: null,
                course_name, 
                course_credit_amount, 
                course_day_selection, 
                course_start_time, 
                course_end_time
            })
        }
    } catch (err) {
        res.render("errors/error", {
            message: err.message,
            link: '/admin',
            section: 'account',
            title: 'Error'
        })
    }
    
}

/* *******************
 * Get Assignment Data
**********************/
async function buildAssignment(req, res){
    try {
        const account_id = res.locals.accountData.account_id
        const courses = await accountModel.getCoursesByAccountId(account_id)
        console.log('Account ID:', account_id)
        console.log('Courses:', courses)
        res.render('account/assignments', {
            title: 'Data',
            link: 'assignments',
            errors: null,
            courses
        })
    } catch (err) {
        res.render("errors/error", {
            message: err.message,
            link: '/account', 
            section: 'account',
            title: 'Error'
        })
    }
}

async function addAssignment(req, res){
    console.log('Adding Assignment')
    try {
        const { assignment_name, assignment_description, assignment_due_date, course_id } = req.body
        console.log('Assignment Name:', assignment_name)
        console.log('Assignment Due Date:', assignment_due_date)
        console.log('Course ID:', course_id)

        let addAssignment = await accountModel.addAssignment(assignment_name, assignment_due_date, course_id)
        if (addAssignment) {
            req.flash('notice', 'Assignment Added Successfully')
            res.redirect('/account/assignment')
        } else {
            req.flash('error', 'Error adding Assignment')
            res.render('/account/assignment', {
                title: 'Data',
                link: 'account/assignments',
                section: 'account',
                errors: null,
                assignment_name,
                assignment_description,
                assignment_due_date,
                course_id
            })
        }
    } catch (err) {
        res.render("errors/error", {
            message: err.message,
            link: '/account',
            section: 'account',
            title: 'Error'
        })
    }
}

async function buildStudy(req, res){
    try {
        res.render('account/studyTimes', {
            title: 'Data',
            link: 'study',
            errors: null,
        })
    } catch (err) {
        res.render("errors/error", {
            message: err.message,
            link: '/account',
            section: 'account',
            title: 'Error'
        })
    }
}

async function addStudy(req, res){
    try {
        const { study_selection, study_start_time, study_end_time, account_id } = req.body
        console.log('Study Selection:', study_selection)
        let study_selection_list
        if (typeof study_selection === 'object') {
            study_selection_list = course_day_selection.join(',')
        } else {
            study_selection_list = study_selection
        }
        console.log('Study Day:', study_selection_list)
        console.log('Study Start Time:', study_start_time)
        console.log('Study End Time:', study_end_time)
        console.log('Account ID:', account_id)

        let addStudy = await accountModel.addStudy(study_selection_list, study_start_time, study_end_time, account_id)
        if (addStudy) {
            req.flash('notice', 'Study Time Added Successfully')
            res.redirect('/account/study')
        } else {
            req.flash('error', 'Error adding Study Time')
            res.render('/account/study', {
                title: 'Data',
                link: 'account/study',
                section: 'account',
                errors: null,
                study_day,
                study_start_time,
                study_end_time,
                account_id
            })
        }
    } catch (err) {
        res.render("errors/error", {
            message: err.message,
            link: '/account',
            section: 'account',
            title: 'Error'
        })
    }
}

module.exports = {
    buildRegister,
    buildMyAccount,
    buildSchedule,
    buildData,
    registerAccount,
    accountLogin,
    accountLogout,
    practice,
    addCourses,
    buildAssignment,
    addAssignment,
    buildStudy,
    addStudy
}