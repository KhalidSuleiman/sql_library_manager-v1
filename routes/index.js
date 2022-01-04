
var express = require("express");
var router = express.Router();
const Book = require("../models").Book;





// wrapper for asynchronous handling of all routing functions 
// and raise an error if needed 
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
router.get("/",
  asyncHandler((req, res, next) => {
  res.redirect("/books");
}));

// List all available books from Database 
router.get('/books', 
  asyncHandler(async (req, res, next) => {
  try{
    const books = await Book.findAll();
    const bookCount=books.length;
    console.log(books.length);
    return res.render('index', { books: books, title:"Khalid's Library", bookCount:bookCount});
  }catch(error){
    next(error);
  }

  }) 

);
// create new book 
router.get('/books/new', 
  asyncHandler((req, res, next) => {

  error =null; 
  res.render("newBook",  {title: "Add a New  Book To Library"});
}));

/* *
 post created book to database if there is a missing information will prompt 
 with in the form and display the form and entered data  

 */

router.post('/books/new', 
  asyncHandler(async(req, res, next)=> {
  let books; 
  
  try{
    
    books = await Book.create(req.body);
    res.redirect("/" );

  }catch(error){
     console("error catch ")   
    if (error.name === "SequelizeValidationError") {
          
      books = req.body;
          
        await res.render("newBook", {books:books, error: error.errors, title: "Add New Book To Library"});
    } 
  }
    
}));

 




  //show one book and option for delete edit and go back 

router.get('/books/:id/update', 
  asyncHandler(async (req,res,next)=>{
    const books = await Book.findByPk(req.params.id);
    
    res.render('update', { books});
}))

// post edited book into database 
router.post('/books/:id/update', asyncHandler(async (req, res) => {
    let books;
      
      books = await Book.findByPk(req.params.id);
      
      if (books) {
        await books.update(req.body);
        
        res.redirect("/books");
      } else {
        res.sendStatus(404);
      }
    
      
}));

// delete a record permanently from Database 
router.get('/books/:id/delete', asyncHandler(async (req,res,next)=>{
  let book; 
  book = await Book.findByPk(req.params.id);
  
  if (book) {
    await book.destroy();
    res.redirect("/");
  } else {
      
      res.sendStatus(404);
  }
}))

// retrieve individual selected book 
router.get('/books/:id', asyncHandler(async (req,res,next)=>{
  let books;
  error = new Error('Book Not Found')
  error.status = 500;
  books = await Book.findByPk(req.params.id);
  if (books){
    console.log(books);
    res.render('show', {books});
  }else {
    next(error)
  } 
}))


module.exports = router;
