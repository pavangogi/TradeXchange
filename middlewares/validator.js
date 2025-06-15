const {body} = require('express-validator');
const {validationResult} = require('express-validator');
exports.isValidId = (req,res,next) => {
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let error = new Error('Invalid Id');
        error.status = 400;
        next(error);
    }
    else{
        next();
    }
}

exports.isValidIdsforTransac = (req,res,next) => {
    let idb = req.params.idg;
    let ids = req.params.idt;
    if(!idb.match(/^[0-9a-fA-F]{24}$/)){
        let error = new Error('Invalid Id');
        error.status = 400;
        next(error);
    }
    else if(!ids.match(/^[0-9a-fA-F]{24}$/)){
        let error = new Error('Invalid Id');
        error.status = 400;
        next(error);
    }
    else{
        next();
    }

}

exports.validateSignUp = [body('firstName', 'First name cannot be empty').notEmpty().trim().escape(),
body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(), 
body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max:64})];

exports.validateLogIn = [body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max:64})];

exports.validateResult = (req, res, next) =>{
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        errors.array().forEach(error=>{
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    } else {
        return next();
    }
}