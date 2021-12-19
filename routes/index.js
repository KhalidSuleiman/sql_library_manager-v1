var express = require('express');
var router = express.Router();
const Book =require('../models').Book

/* GET home page. */
router.get('/', function(req, res, next) {
  Book.findAll().then(function(books){
    res.render("index", {books: books, title: "My Library" });
    console.log(books)
  });

 /*  // Handler function to wrap each route. 
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}
*/
/**
 * (async () => {
  const allBooks = await  Book.findAll();
  res.json(allBooks);
  console.log("Khalid")
  console.log(res.json(allBooks))
  //res.render(res.json())
})
*/


});

module.exports = router;
