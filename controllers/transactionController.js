const tradeModel = require("../models/trade");
const transactionModel = require("../models/transaction");
const watchModel = require("../models/watchlist");

exports.postTrade = (req, res, next) => {
  tradeModel
    .findById(req.params.idt)
    .then((result) => {
      let transaction = new transactionModel({
        giverId: req.session.user,
        giveItem: req.params.idg,
        takerId: result.createdBy,
        takeItem: req.params.idt,
        status: "pending",
      });
      transaction
        .save()
        .then((transaction) => {
          tradeModel
            .findById(req.params.idg)
            .then((trade) => {
              trade.status = "tradeOffered";
              trade
                .save()
                .then()
                .catch((err) => next(err));
            })
            .catch((err) => next(err));
          tradeModel
            .findById(req.params.idt)
            .then((trade) => {
              trade.status = "tradeOffered";
              trade
                .save()
                .then()
                .catch((err) => next(err));
            })
            .catch((err) => next(err));
          req.flash("success", "Trade Created.");
          res.redirect("/users/profile");
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => next(err));
};

exports.cancelTrade = (req, res, next) => {
  let transactionId = req.params.transId;
  transactionModel
    .findById(transactionId)
    .then((transaction) => {
      transaction.status = "cancelled";
      transaction
        .save()
        .then((transaction) => {
          tradeModel
            .findById(transaction.giveItem)
            .then((trade) => {
              trade.status = "available";
              trade
                .save()
                .then()
                .catch((err) => next(err));
            })
            .catch((err) => next(err));
          tradeModel
            .findById(transaction.takeItem)
            .then((trade) => {
              trade.status = "available";
              trade
                .save()
                .then()
                .catch((err) => next(err));
            })
            .catch((err) => next(err));
          req.flash("success", "Trade cancelled.");
          res.redirect("/users/profile");
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

exports.acceptTransaction = (req, res, next) => {
    let id = req.params.transId;
    console.log("Started reject");
    transactionModel
      .findById(id)
      .then((transaction) => {
        transaction.status = 'accepted';
        console.log("transaction status set");
        transaction.save()
        .then(transaction => {
            Promise.all([
                tradeModel.findById(transaction.giveItem),
                tradeModel.findById(transaction.takeItem),
              ])
                .then((results) => {
                  const [giveTrade, takeTrade] = results;
                  giveTrade.status = 'available';
                  takeTrade.status = 'available';
                  let giverOwner = giveTrade.createdBy;
                  giveTrade.createdBy = takeTrade.createdBy;
                  takeTrade.createdBy = giverOwner;
                  console.log("status set for items");
                  Promise.all([giveTrade.save(), takeTrade.save()])
                    .then((results) => {
                    console.log("before flash");
                      req.flash("success", "Trade accepted.");
                      console.log("before route");
                      res.redirect("/users/profile");
                    })
                    .catch((err) => next(err));
                })
                .catch((err) => next(err));
        })
        .catch((err) => next(err));
      })
      .catch((err) => next(err));
};

exports.rejectTransaction = (req, res, next) => {
    let id = req.params.transId;
    console.log("Started reject");
    transactionModel
      .findById(id)
      .then((transaction) => {
        transaction.status = 'rejected';
        console.log("transaction status set");
        transaction.save()
        .then(transaction => {
            Promise.all([
                tradeModel.findById(transaction.giveItem),
                tradeModel.findById(transaction.takeItem),
              ])
                .then((results) => {
                  const [giveTrade, takeTrade] = results;
                  giveTrade.status = 'available';
                  takeTrade.status = 'available';
                  console.log("status set for items");
                  Promise.all([giveTrade.save(), takeTrade.save()])
                    .then((results) => {
                    console.log("before flash");
                      req.flash("error", "Trade rejected.");
                      console.log("before route");
                      res.redirect("/users/profile");
                    })
                    .catch((err) => next(err));
                })
                .catch((err) => next(err));
        })
        .catch((err) => next(err));
      })
      .catch((err) => next(err));
  };

  exports.watchlist = (req,res,next) => {
      let id = req.params.tradeId;
      let watchlist = new watchModel({
        userId: req.session.user,
        itemId: id
      });

      watchModel.findOne({
        userId: req.session.user,
        itemId: id
      })
      .then(existItem => {
          console.log(existItem);
          if(existItem == null){
            watchlist.save()
            .then(watch => {
            })
            .catch(err => next(err));
          }
          res.redirect("/users/profile");
      })
      .catch(err => next(err));

      
  } 

  exports.deleteWatch = (req, res, next) => {
    console.log("delete Id",req.params.watchId);
    watchModel.findByIdAndDelete(req.params.watchId)
    .then( data => {
      res.redirect("/users/profile");
    }
    ).catch(err=> next(err));
  };