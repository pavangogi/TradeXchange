const { promise } = require("bcrypt/promises");
const tradeModel = require("../models/trade");
const transactionModel = require("../models/transaction");

function uniqueBy(arr, prop) {
  return arr.reduce((a, d) => {
    if (!a.includes(d[prop])) {
      a.push(d[prop]);
    }
    return a;
  }, []);
}

//GET /trades : send all trades
exports.index = (req, res) => {
  tradeModel
    .find()
    .then((trades) => {
      const categories = uniqueBy(trades, "category");
      res.render("./trade/trades", { trades, categories });
    })
    .catch((err) => {
      next(err);
    });
};

//GET /trades/new : send html form for creating a new trade
exports.new = (req, res) => {
  res.render("./trade/newTrade");
};

//POST /trades : create a new trade
exports.create = (req, res) => {
  let trade = new tradeModel(req.body);
  trade.createdBy = req.session.user;
  trade.status = "available";
  trade
    .save()
    .then(() => res.redirect("/trades"))
    .catch((err) => {
      if (err.name === "ValidationError") {
        err.status = 400;
      }
      next(err);
    });
};

//GET /trades/:id : send a trade identified by id.
exports.show = (req, res, next) => {
  let id = req.params.id;
  let user = req.session.user;
  Promise.all([tradeModel.findById(id), tradeModel.find({ createdBy: user })])
    .then((results) => {
      const [trade, trades] = results;
      if (trade) {
        console.log(trades);
        res.render("./trade/trade", { trade, trades });
      } else {
        let err = new Error("Cannot find a trade with id " + id);
        err.status = 404;
        next(err);
      }
    })
    .catch((err) => next(err));
};

//GET /trades/:id/edit : send html form for editing the trade.
exports.edit = (req, res, next) => {
  let id = req.params.id;
  tradeModel
    .findById(id)
    .then((trade) => {
      if (trade) {
        res.render("./trade/edit", { trade });
      } else {
        let err = new Error("Cannot find a trade with id " + id);
        err.status = 404;
        next(err);
      }
    })
    .catch((err) => next(err));
};

//PUT /trades/:id  : update the trade identified by id
exports.update = (req, res, next) => {
  let trade = req.body;
  let id = req.params.id;

  tradeModel
    .findByIdAndUpdate(id, trade, {
      useFindAndModify: false,
      runValidators: true,
    })
    .then((trade) => {
      if (trade) {
        return res.redirect("/trades/" + id);
      } else {
        let err = new Error("Cannot find a trade with id " + id);
        err.status = 404;
        next(err);
      }
    })
    .catch((err) => {
      if (err.name == "ValidationError") {
        err.status = 400;
        req.flash("error", err.message);
        res.redirect("back");
      }
      next(err);
    });
};

//DELETE /trades/:id  : delete the trade identified by id
exports.delete = (req, res, next) => {
  let id = req.params.id;
  tradeModel
    .findByIdAndDelete(id, { useFindAndModify: false })
    .then((trade) => {
      if (trade) {
        res.redirect("/trades");
      } else {
        let err = new Error("Cannot find a trade with id " + id);
        err.status = 404;
        next(err);
      }
    })
    .catch((err) => {
      next(err);
    });
};
