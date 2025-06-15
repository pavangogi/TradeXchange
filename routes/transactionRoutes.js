const express = require("express");
const router = express.Router();
const controller = require("../controllers/transactionController");
const{isLoggedIn, isAuthor} = require('../middlewares/auth');
const{isValidId,isValidIdsforTransac} = require('../middlewares/validator');

//to cancel the transaction
router.post("/:transId",controller.cancelTrade);

//to accept the transaction
router.post("/:transId/accept", controller.acceptTransaction);

//to reject the transaction
router.post("/:transId/reject", controller.rejectTransaction);

//to add a trade to watchlist
router.post("/:tradeId/watchlist",controller.watchlist);

// to post a trade request.
router.post("/:idg/:idt", isValidIdsforTransac, isLoggedIn, controller.postTrade);

//to delete watch list
router.delete("/deleteWatch/:watchId",controller.deleteWatch);

module.exports = router;