const Util = module.exports = {}
// const menuModel = require("../models/menuModel")
const jwt = require('jsonwebtoken')
require("dotenv").config()

/* **************************************
  * Middleware to check token validity
****************************************/
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData){
                if (err) {
                    req.flash('notice','Please Log In')
                    res.clearCookie('jwt')
                    return res.redirect('/account/login')
                }
            res.locals.accountData = accountData
            res.locals.loggedin = 1
            next()
        })
    } else {
    next()
    }
}

  /* **************************************
   * Check Login
  ****************************************/
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
    next()
    } else {
        req.flash('error','Permission Denied. You are not authorized to view this page.')
        return res.redirect('/account/login')
    }
}

  /* **************************************
  * Check Authorization
  ****************************************/
Util.checkAuth = (req, res, next) => {
    if (res.locals.accountData.account_type !== 'Client') {
    next()
    } else {
        req.flash('error','Permission Denied. You are not authorized to view this page.')
        return res.redirect('/account/login')
    }
}

  /* **************************************
   * Check Admin
  ****************************************/
Util.checkAdmin = (req, res, next) => {
    if (res.locals.accountData.account_type === 'Admin' || res.locals.accountData.account_type === 'DBA') {
    next()
    } else {
        req.flash('error','Permission Denied. You are not authorized to view this page.')
        return res.redirect('/account/login')
    }
}

// /* ******************************
//  * Build Menu Cards
//     *******************************/
// Util.getMenu = (menu) => {
//     let menuCards = ''
//     menuCards += `<div class="menuCard">`
//     menu.forEach((menuItem) => {
//         menuCards += `<div class="card">
//         <img src="${menuItem.inv_image}" class="card-img-top" alt="${menuItem.inv_name}">
//         <div class="card-body">
//             <h5 class="card-title">${menuItem.inv_name}</h5>
//             <p class="card-description">${menuItem.inv_description}</p>
//             <p class="card-category">Category: ${menuItem.category_name}</p>
//             <p class="card-quantity">Quantity: ${menuItem.inv_quantity}</p>
//             <p class="card-price">Price: $${menuItem.inv_price}</p>
//         </div>
//         </div>`
//     })
//     menuCards += '</div>'
//     return menuCards
// }


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util