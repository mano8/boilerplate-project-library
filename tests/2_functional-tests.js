/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
let bookId = null;
suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  /*test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });*/
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({
          title: 'testBookTitle'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.property(res.body, 'comments', 'Book should contain comments');
          assert.property(res.body, 'title', 'Book should contain title');
          assert.property(res.body, '_id', 'Book should contain _id');
          bookId = res.body._id;
          done();
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({
          title: null
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isString(res.text, 'response should be a string');
          assert.isTrue(res.text === 'missing required field title', 'If title is empty must return : missing required field title ');
          done();
        });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], '_id', 'Books in array should contain _id');
          done();
        });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books/azerty')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isString(res.text, 'response should be a string');
          assert.isTrue(res.text === 'no book exists', 'If id is not in db must return : no book exists ');
          done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get('/api/books/'+bookId)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.property(res.body, 'comments', 'Book should contain comments');
          assert.property(res.body, 'title', 'Book should contain title');
          assert.property(res.body, '_id', 'Book should contain _id');
          done();
        });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post('/api/books/'+bookId)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({
          comment: 'very good'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.property(res.body, 'comments', 'Book should contain comments');
          assert.property(res.body, 'title', 'Book should contain title');
          assert.property(res.body, '_id', 'Book should contain _id');
          done();
        });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
        .post('/api/books/'+bookId)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({
          comment: null
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isString(res.text, 'response should be a string');
          assert.isTrue(res.text === 'missing required field comment', 'If empty comment must return : missing required field comment ');
          done();
        });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
        .post('/api/books/azerty')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({
          comment: 'very good'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isString(res.text, 'response should be a string');
          assert.isTrue(res.text === 'no book exists', 'must return : no book exists ');
          done();
        });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
        .delete('/api/books/'+bookId)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isString(res.text, 'response should be a string');
          assert.isTrue(res.text === 'delete successful', 'must return : delete successful ');
          done();
        });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
        .delete('/api/books/65350ad7e17abe540f0fac97')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isString(res.text, 'response should be a string');
          assert.isTrue(res.text === 'no book exists', 'must return : no book exists ');
          done();
        });
      });

    });

  });

});

// after(function() {
//   chai.request(server)
//     .get('/')
// });

teardown(function() {
  chai.request(server)
    .get('/')
});
