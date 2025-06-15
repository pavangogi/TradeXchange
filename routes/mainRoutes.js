const express = require("express");
const router = express.Router();
const controller = require("../controllers/mainController");


//GET / : for home page
router.get("/", controller.index);

//GET /contact : for contact page
router.get("/contact", controller.contact);

//GET /about : for about page.
router.get("/about", controller.about);

module.exports = router;

