const baseController = {}

baseController.buildHome = async function(req, res){
    res.render('index', {
        title: 'Home', 
        link: '', 
        errors: null
    })
}

baseController.buildAbout = async function(req, res){
    res.render('about/about', {
        title: 'About Us', 
        link: 'about', 
        errors: null
    })
}

module.exports = baseController