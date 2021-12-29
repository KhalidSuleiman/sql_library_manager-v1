
var express = require("express");
var router = express.Router();
const Book = require("../models").Book;




// wrapper for asynchronous handling of all routing functions 
function asyncHandler (cb) {
  return async (req, res, next) => {
    try {
      await cb (req, res, next);
    } catch (err) {
      next(err);
    }
  }
}


// redirects / to books
router.get("/", (req, res, next) => {
  res.redirect("/books");
});

// List all available books
router.get('/books', asyncHandler(async (req, res) => {
  
    const books = await Book.findAll();
    console.log(books);
    res.render('index', { books: books, title:"Khalid's Library"});
  }));

  //show one book and option for delete edit and go back 

  router.get('/books/:id/edit', asyncHandler(async (req,res,next)=>{
    const books = await Book.findByPk(req.params.id);
    console.log(books);
    res.render('update', { books});
  }))

  router.post('/books/:id/update', asyncHandler(async (req, res) => {
    let book;
   
      book = await Book.findByPk(req.params.id);
      if (book) {
        await book.update(req.body);
        console.log(req.body)
        res.redirect("/books");
      } else {
        res.sendStatus(404);
      }
    
      
  }));

  router.get('/books/:id', asyncHandler(async (req,res,next)=>{
    let books;
    books = await Book.findByPk(req.params.id);
    res.render('show', {books});
  }))

  router.get('/books/:id/delete', asyncHandler(async (req,res,next)=>{
    let book; 
    book = await Book.findByPk(req.params.id);
    console.log(book.title)
    if (book) {
      await book.destroy();
      res.redirect("/");
    } else {
      res.sendStatus(404);
    }
  }))
module.exports = router;
