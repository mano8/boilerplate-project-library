/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const Book = require('../models/Book');

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.getAllBooks((err, books)=>{
        if(err){
          res.json(err)
        }else{
          res.json(books)
        }
      })
      
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      let book = new Book({'title': title, 'comments': []});
      book.save()
      .then((data) => {
        res.json(data)
      })
      .catch((err)=>{
        res.send('missing required field title')
      });
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteAllBooks((err, data) => {
        if(err){
          res.json(err)
        }else{
          res.send('complete delete successful')
        }
      });        
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findBookById(bookid, (err, book) => {
        if(err){
          res.send('no book exists')
        }else{
          if(book!==null){
            res.json(book)
          }
          else{
            res.send('no book exists')
          }
        }
      });
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      Book.addBookComment(bookid, comment, (err, data) => {
        if(err){
          res.send('no book exists')
        }else{
          if(data !== null){
            res.json(data)
          }else{
            res.send('missing required field comment')
          }
        }
      });
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.deleteBookById(bookid, (err, data) => {
        if(err){
          res.send('no book exists')
        }else{
          res.send('delete successful')
        }
      });
    });
  
};
