const mongoose = require('mongoose');
const Ut = require('../utils/utils');
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    comments: [String],
  },
  {
    statics: {
      getAllBooks(done) {
        this.find()
        .then((books) => {
            const result = books.map(val=>{
                return {
                    "_id": val._id, 
                    "title": val.title, 
                    "commentcount": val.comments.length }
            })
            done(false, result)
        })
        .catch((err)=>{
          done(err)
        });
      },
      findBookById(bookId, done){
        this.findOne({"_id": bookId})
            .then((data) => {
              if(data !== null){
                const result = {
                  _id: bookId,
                  title: data.title,
                  comments: data.comments
                }
                done(false, result)
              }else{
                done(false, null);
              }
              
            })
            .catch((err)=>{
              done(err)
            });
      },
      addBookComment(bookId, comment, done){
        if(Ut.isStrNotEmpty(comment)){
          this.findByIdAndUpdate({"_id": bookId}, {$push: {comments: comment}})
            .then((data) => {
              const result = {
                _id: bookId,
                title: data.title,
                comments: [...data.comments, comment]
              }
              done(false, result)
            })
            .catch((err)=>{
              done(err)
            });
        }else{
          done(false, null)
        }
        
      },
      deleteBookById(bookId, done){
        this.deleteOne({"_id": bookId})
          .then((data)=>{
            if(Ut.isObject(data) && Ut.isPositiveNumber(data.deletedCount)){
              done(false, data)
            }else{
              done(true)
            }
            
          })
          .catch((err)=>{
            done(err)
          })
      },
      deleteAllBooks(done){
        this.deleteMany()
          .then((data)=>{
            done(false, data)
          })
          .catch((err)=>{
            done(err)
          })
      }
    }
    
  });


let Book = mongoose.model('Book', bookSchema);

module.exports = Book;