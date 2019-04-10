var express = require('express');
var rxjs = require('rxjs');
var app = express();
var fs = require("fs");

const asyncMiddleware = func =>
  (req, res, next) => {
    Promise.resolve(func(req, res, next))
      .catch(next);
};

// var mongoose = require('mongoose');

// var Schema = mongoose.Schema;

// var SomeModelSchema = new Schema({
//   a_string: String,
//   a_date: Date
// });

// Compile model from schema
// var SomeModel = mongoose.model('SomeModel', SomeModelSchema );

app.get('/listUsers', function (request, response) {
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
      console.log( data );
      response.end( data );
   });
})

// app.post('/user/:id', (req, res) => {
//    return getUserById(req.params.id)
//      .toPromise()/* return the Rx stream as promise to express so it traces its lifecycle */
//      .then(
//        user => res.send(user),
//        err => res.status(500).send(err.message)
//      );
//  });    
 
//  function getUserById(id) {
//    // stub implementation
//    return Rx.Observable.of({ id, name: 'username' }) 
//      .delay(100);
//  }

// app.get('/users/:id', asyncMiddleware(async (req, res, next) => {
//    /* 
//      if there is an error thrown in getUserFromDb, asyncMiddleware
//      will pass it to next() and express will handle the error;
//    */
//    const user = await getUserFromDb({ id: req.params.id })
//    res.json(user);
// }));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.post('/addUser/:request_id', function (request, response) {
   
   console.log(request.body.timestamp);
   console.log(request.body.data[0].title);
   console.log(request.body.data[0].values);
   console.log(request.body.timestamp);
   console.log(request.body.data[1].title);
   console.log(request.body.data[1].values);
   console.log(request.params.request_id);
   
   let timestamp = request.body.timestamp;
   let request_id = request.params.request_id;
   let data = { timestamp, request_id };
   response.end(JSON.stringify(data));
   
})

app.post('/arraySubtract/:request_id', asyncMiddleware(async (request, response, next) => {
   
   let intermediate_result = await elementwiseSubtraction(request.body.data);
   let request_id = request.params.request_id;
   let timestamp = request.body.timestamp;
   let title = 'Result';
   let values = intermediate_result;
   let result = {title, values}
   let data = { request_id, timestamp, result };
   response.end(JSON.stringify(data));

}))

function elementwiseSubtraction(data)
{
   var a = data[0].values;
   var b = data[1].values;
   a.forEach(function(item, index, result) {
     result[index] = item - b[index];   
   });
   
   return a;
}
var server = app.listen(8081, function () {
   var host = server.address().address;
   var port = server.address().port;
   console.log("Example app listening at http://%s:%s", host, port);
})