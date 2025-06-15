const express = require("express");
const router = express.Router();
const controller = require("../controllers/tradeController");
const{isLoggedIn, isAuthor} = require('../middlewares/auth');
const{isValidId,isValidIdsforTransac} = require('../middlewares/validator');


//GET /trades : send all trades
router.get("/", controller.index);

//GET /trades/new : send html form for creating a new trade
router.get("/newTrade", isLoggedIn, controller.new);

//POST /trades : create a new trade
router.post("/",isLoggedIn, controller.create);

//GET /trades/:id : send a trade identified by id.
router.get("/:id",isValidId, controller.show);

//GET /trades/:id/edit : send html form for editing the trade.
router.get("/:id/edit",isValidId, isLoggedIn, isAuthor, controller.edit);

//PUT /trades/:id  : update the trade identified by id
router.put("/:id",isValidId, isLoggedIn, isAuthor, controller.update);

//DELETE /trades/:id  : delete the trade identified by id
router.delete("/:id",isValidId, isLoggedIn, isAuthor, controller.delete);

module.exports = router;
