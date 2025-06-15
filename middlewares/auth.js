const Trade = require('../models/trade');

exports.isLoggedIn = (req,res,next) => {
    if(req.session.user){
        next()
    }else {
        req.flash("error","You are not logged in");
        res.redirect('/users/login');
    }
}

exports.isGuest = (req,res,next) => {
    if(!req.session.user){
        next()
    }else {
        req.flash("error","Already logged in.");
        res.redirect("/users/profile");
    }
}

exports.isAuthor = (req,res,next) => {
    let id = req.params.id;
    Trade.findById(id)
    .then(trade => {
        if(trade.createdBy == req.session.user){
            next()
        }else {
            let err = new Error('You are not the author.');
            err.status = 401;
            next(err);
        }
    })
    .catch(err => {next(err)});
}