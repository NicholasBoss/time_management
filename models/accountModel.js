const pool = require('../database/')

/* ***************
 * Create Account
* *************** */
async function createAccount(account_firstname, account_lastname, account_email, account_password) {
    console.log('Creating account')
    console.log('Account First Name:', account_firstname)
    console.log('Account Last Name:', account_lastname)
    console.log('Account Email:', account_email)
    console.log('Account Password:', account_password)
    try {
        const sql = 'INSERT INTO account (account_firstname, account_lastname, account_email, account_password) VALUES ($1, $2, $3, $4) RETURNING *'
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
        return error.message
    }
}

/* ***************************
  * Return account data using account ID
***************************** */
async function getAccountById(account_id){
    try {
      const result = await pool.query(
        'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1', 
        [account_id])
        return result.rows[0]
    } catch (error) {
      return new Error("No matching account found")
    }
  }

/* ***********************
    * Check Existing Email
    *************************/
async function checkExistingEmail(account_email) {
    try {
        const sql = 'SELECT account_email FROM account WHERE account_email = $1'
        const email = await pool.query(sql, [account_email])
        return email.rowCount
    } catch (error) {
        return error.message
    }
}

/* ***************************
 * Return account data using email address
***************************** */
async function getAccountByEmail(account_email){
    // console.log('Getting account by email:', account_email)
    try {
        const result = await pool.query(
        'SELECT account_id, account_firstname, account_lastname, account_email, account_password FROM account WHERE account_email = $1', 
        [account_email])
        // console.log('Result:',result)
        return result.rows[0]
    } catch (error) {
        return new Error("No matching email found")
    }
}

async function createCourse(course_name, course_credit_amount, course_day_selection, course_end_time, course_start_time, account_id) {
    try {
        const sql = 'INSERT INTO course (course_name, course_credit_amount, course_day_selection, course_end_time, course_start_time, account_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *'
        return await pool.query(sql, [course_name, course_credit_amount, course_day_selection, course_end_time, course_start_time, account_id])
    } catch (error) {
        return error.message
    }
    
}

async function addCourse(course_name, course_credit_amount, course_day_selection, course_start_time, course_end_time, account_id) {
    try {
        const sql = 'INSERT INTO course (course_name, course_credit_amount, course_day_selection, course_start_time, course_end_time, account_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *'
        return await pool.query(sql, [course_name, course_credit_amount, course_day_selection, course_start_time, course_end_time, account_id])
    } catch (error) {
        return error.message
    }
}

async function getCoursesByAccountId(account_id){
    try {
        const result = await pool.query('SELECT * FROM course WHERE account_id = $1', [account_id])
        return result.rows
    } catch (error) {
        return error.message
    }
}

async function addAssignment(assignment_name, assignment_due_date, course_id) {
    try {
        const sql = 'INSERT INTO assignment (assignment_name, assignment_due_date, course_id) VALUES ($1, $2, $3) RETURNING *'
        return await pool.query(sql, [assignment_name, assignment_due_date, course_id])
    } catch (error) {
        return error.message
    }
}

async function addStudy(study_selection, study_start_time, study_end_time, account_id) {
    study_start_time = study_start_time + ':00'
    study_end_time = study_end_time + ':00'
    console.log('Adding study time')
    console.log('Study Selection:', study_selection)
    console.log('Study Start Time:', study_start_time)
    console.log('Study End Time:', study_end_time)
    console.log('Account ID:', account_id)
    try {
        const sql = 'INSERT INTO study (study_selection, study_start_time, study_end_time, account_id) VALUES ($1, $2, $3, $4) RETURNING *'
        return await pool.query(sql, [study_selection, study_start_time, study_end_time, account_id])
    } catch (error) {
        return error.message
    }
}

async function getSchedule(account_id) {
    try {
        const result = await pool.query('SELECT course_name, course_start_time, course_end_time, course_end_time - course_start_time AS course_length, assignment_name, assignment_due_date, study_start_time, study_end_time, study_end_time - study_start_time AS study_length, course_day_selection FROM course c INNER JOIN assignment a ON c.course_id = a.course_id INNER JOIN account ac ON c.account_id = ac.account_id INNER JOIN study s ON ac.account_id = s.account_id WHERE ac.account_id = $1', [account_id])
        console.log('Schedule:', result.rows)
        return result.rows
    } catch (error) {
        return error.message
    }
}

/* ***************************
  * Export model functions
***************************** */
module.exports = {
    createAccount,
    getAccountById,
    checkExistingEmail,
    getAccountByEmail,
    createCourse,
    addCourse,
    getCoursesByAccountId,
    addAssignment,
    addStudy,
    getSchedule
}