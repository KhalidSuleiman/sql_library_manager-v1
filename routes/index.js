
var express = require("express");
var router = express.Router();
const Book = require("../models").Book;

var app = express();



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
router.get("/", asyncHandler((req, res, next) => {
  res.redirect("/books");
}));

// List all available books
router.get('/books', asyncHandler(async (req, res, next) => {
  try{
  const books = await Book.findAll();
  const bookCount=books.length;
  console.log(books.length);
  res.render('index', { books: books, title:"Khalid's Library", bookCount:bookCount});
  }catch(error){
    next(error);
  }

  }) 

);

  //show one book and option for delete edit and go back 

router.get('/books/:id/edit', asyncHandler(async (req,res,next)=>{
    const books = await Book.findByPk(req.params.id);
    
    res.render('update', { books});
}))

router.post('/books/:id/update', asyncHandler(async (req, res) => {
    let book;
   
      book = await Book.findByPk(req.params.id);
      if (book) {
        await book.update(req.body);
        
        res.redirect("/books");
      } else {
        res.sendStatus(404);
      }
    
      
}));

router.get('/books/:id', asyncHandler(async (req,res,next)=>{
  let books;
  error = new Error('Book Not Found')
  books = await Book.findByPk(req.params.id);
  if (books){
    res.render('show', {books});
  }else res.sendStatus(500).render('error',{error})
}))

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

router.get('/new', asyncHandler((req, res, next) => {
  res.render("newBook",  {title: "Add New Book To Library"});
}));

 
router.post('/new', asyncHandler(async(req, res, next)=> {
  let book; 
  try{
    book = await Book.create(req.body);
    res.redirect("/" );

  }catch(error){
        
    if (error.name === "SequelizeValidationError") {
          
      book = req.body;
          
        res.render("newBook", {books:book, error: error.errors, title: "Add New Book To Library"});
    } else {
      next(error) //throw error;
    }
  }
    
}));

module.exports = router;
