const express = require('express');
const app = express();

const asyncMiddleware = func =>
  (req, res, next) => {
    Promise.resolve(func(req, res, next))
      .catch(next);
};

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.post('/arraySubtract/:request_id', asyncMiddleware(async (request, response, next) => {
   
   const request_id = request.params.request_id;
   const timestamp = request.body.timestamp;
   const source_data = request.body.data;
   var intermediate_result;

   try 
   {
      if (!request_id || !timestamp || !validateInput(source_data)) 
      {
         response.end('Invalid input encountered');
      }

      intermediate_result = Array.from({ length: source_data[0].values.length }, () => 0);   
      intermediate_result = await elementwiseSubtraction(source_data);
   }
   catch (error)
   {
      response.end('an exception thrown in API call: arraySubtract');
   }
   
   const title = 'Result';
   const values = intermediate_result;
   const result = {title, values}
   const response_data = { request_id, timestamp, result };
   response.end(JSON.stringify(response_data));

}))

function validateInput(input)
{
   if (input && input.length === 2 && input[0] && input[1]
         && input[0].values && input[1].values 
         && input[0].values.length === input[1].values.length)
   {
      return true;
   }
   else
   {
      return false;
   }
}

function elementwiseSubtraction(data)
{
   const a = data[0].values;
   const b = data[1].values;

   //element-wise subtraction in an array
   try
   {
      a.forEach(function(item, index, result) {
         result[index] = item - b[index];   
      });
      
      if (a.includes(NaN))
      {
         throw new Error("some elements in the arrays are probably not number typed, please check the inputs.");
      }
   }
   catch(error) {
      console.log(error.name + ': ' + error.message);
      throw error;
   }
   
   return a;
}

var server = app.listen(8081, '127.0.0.1', function () {
   const host = server.address().address;
   const port = server.address().port;
   console.log('Example application listening at http://%s:%s', host, port);
})