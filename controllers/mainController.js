//GET / : for home page
exports.index = (req, res) => {
    res.render("index");
  };

//GET /about : for about page
  exports.about = (req,res)=>{
    res.render('about');
  };

//GET /contact : for contact page
exports.contact = (req,res)=>{
    res.render('contactUs');
  };