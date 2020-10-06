const express = require('express');
//const bodyParser = require('body-parser');

const app = express();
const fs = require('fs');

const port = 3000;
const tours = JSON.parse(fs.readFileSync(`${__dirname}/data/tours.json`));

app.use(express.json());

// app.use(function (req, res) {
//   res.setHeader('Content-Type', 'text/plain');
//   res.write('you posted:\n');
//   res.end(JSON.stringify(req.body, null, 2));
// });

app.get('/', (req, res) => {
  res.send('Hello wold');
});

// Get tours
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    requests: tours.length,
    data: {
      tours,
    },
  });
});

// Create tour
app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign(
    {
      id: newId,
    },
    req.body
  );

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/data/tours.json`,
    JSON.stringify(tours),
    (error) => {
      res.status(201).json({
        status: 'Success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

// Get tour by id
app.get('/api/v1/tours/:id', (req, res) => {
  //console.log('params', req.params);
  const id = parseInt(req.params.id);
  const tour = tours.find((el) => el.id === id);

  if (tour) {
    return res.status(200).json({
      status: 'Success',
      data: {
        tour,
      },
    });
  }

  res.sendStatus(404);
});

// Update tour
app.patch('/api/v1/tours/:id', (req, res) => {
  console.log('params', req.params);

  const id = parseInt(req.params.id);
  const tour = tours.find((el) => el.id === id);

  if (tour) {
    return res.status(200).json({
      status: 'Updated',
      data: {
        tour,
      },
    });
  }

  res.status(404).send('Element not found');
});

// Delete tour
app.delete('/api/v1/tours/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const tour = tours.find((el) => el.id === id);

  if (tour) {
    return res.status(204).json({
      status: 'Deleted',
      data: {
        tour: null,
      },
    });
  }
  res.sendStatus(404);
});

// App running
app.listen(port, () => {
  console.log(`App listen at port ${port}`);
});
