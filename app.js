const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const fs = require("fs");

const port = 3000;
const tours = JSON.parse(fs.readFileSync(`${__dirname}/data/tours.json`));


// parse application/json
app.use(express.json())
// app.use(function (req, res) {
//   res.setHeader('Content-Type', 'text/plain')
//   res.write('Response:\n')
//   res.end(JSON.stringify(req.body, null, 2))
// })

app.get('/', (req, res) => {
  res.send('Hello wold');
});

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    requests: tours.length,
    data: {
      tours
    }
  })
});

app.post('/api/v1/tours', (req, res) => {
  //console.log("res", req.body)
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({id: newId}, req.body);

  tours.push(newTour);
  fs.writeFile(`${__dirname}/data/tours.json`, JSON.stringify(tours), error => {
   res.status(201).json({
     status: 'Success',
     data: {
       tour: newTour
     }
   })
  })

})

app.listen(port, () => {
  console.log(`App listen at port ${port}`)
})

