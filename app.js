//require modules
const express = require("express");
const morgan = require("morgan");
const tradeRoutes = require("./routes/tradeRoutes");
const mainRoutes = require("./routes/mainRoutes");
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const methodOverride = require("method-override");
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

//create app
const app = express();

//configure app
let port = 3000;
let host = "localhost";
app.set("view engine", "ejs");

//connect to database
mongoose.connect('mongodb://localhost:27017/forextechnologies',{useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    app.listen(port, host, ()=>{
        console.log('Server is running on port', port);
    })
})
.catch(err => {
    console.log(err.message);
});

//mount middleware
app.use(
  session({
      secret: "kjfenyj90aeu9eroejfoefj",
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({mongoUrl: 'mongodb://localhost:27017/forextechnologies'}),
      cookie: {maxAge: 60*60*1000}
      })
);
app.use(flash());

app.use((req, res, next) => {
  //console.log(req.session);
  res.locals.user = req.session.user || null ;
  res.locals.errorMessages = req.flash('error');
  res.locals.successMessages = req.flash('success');
  next();
});

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(methodOverride("_method"));

//setup routes
app.use("/",mainRoutes);
app.use("/trades", tradeRoutes);
app.use('/users', userRoutes);
app.use('/transaction', transactionRoutes);

app.use((req, res, next) => {
  let err = new Error("The server cannot locate " + req.url);
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  if (!err.status) {
    err.status = 500;
    err.message = "Internal server error.";
  }
  res.status(err.status);
  res.render("error", { error: err });
});
