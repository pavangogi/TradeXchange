const model = require("../models/user");
const Trade = require("../models/trade");
const Transaction = require("../models/transaction");
const Wishlist = require("../models/watchlist");


exports.new = (req, res) => {
  res.render("./user/new");
};

exports.create = (req, res, next) => {
  let user = new model(req.body);
  user
    .save()
    .then((user) => {
      req.flash("success","User created Successfully.");
      res.redirect("/users/login");
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        req.flash("error", err.message);
        return res.redirect("/users/new");
      }

      if (err.code === 11000) {
        req.flash("error", "Email has been used");
        return res.redirect("/users/new");
      }
      next(err);
    });
};

exports.getUserLogin = (req, res, next) => {
  res.render("./user/login");
};

exports.login = (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  model
    .findOne({ email: email })
    .then((user) => {
      if (!user) {
        console.log("wrong email address");
        req.flash("error", "wrong email address");
        res.redirect("/users/login");
      } else {
        user.comparePassword(password).then((result) => {
          if (result) {
            req.session.user = user._id;
            req.flash("success", "You have successfully logged in");
            res.redirect("/users/profile");
          } else {
            req.flash("error", "wrong password");
            res.redirect("/users/login");
          }
        });
      }
    })
    .catch((err) => next(err));
};

exports.profile = (req, res, next) => {
  let id = req.session.user;
  Promise.all([
    model.findById(id),
    Trade.find({ createdBy: id }),
    Transaction.find({ giverId: id }).populate( 'takerId','firstName lastName')
                                    .populate('giveItem','category name')
                                    .populate('takeItem', 'category name'),
    Transaction.find({ takerId: id }).populate('giverId','firstName lastName')
                                    .populate('giveItem','category name')
                                    .populate('takeItem', 'category name'),
    Wishlist.find({userId : id}).populate('itemId','category name')
  ])
    .then((results) => {
      const [user, trades, sentTransactions, receivedTransactions, watchlist] = results;
      res.render("./user/profile", {
        user,
        trades,
        sentTransactions,
        receivedTransactions,
        watchlist
      });
    })
    .catch((err) => next(err));
};

exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    else res.redirect("/");
  });
};
