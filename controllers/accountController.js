const accountController = {}

accountController.buildRegister = (req, res) => {
    res.render("account/register", {
        title: "Register",
        link: "register",
        errors: null,
    })
}

accountController.buildMyAccount = (req, res) => {
    res.render("account/myAccount", {
        title: "My Account",
        link: "myAccount",
        errors: null,
    })
}

accountController.buildSchedule = (req, res) => {
    res.render("account/schedule", {
        title: "Schedule",
        link: "schedule",
        errors: null,
    })
}

module.exports = accountController