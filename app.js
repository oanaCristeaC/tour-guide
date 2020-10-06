const express = require('express');
//const bodyParser = require('body-parser');

const app = express();
const fs = require('fs');

const port = 3000;
const tours = JSON.parse(fs.readFileSync(`${__dirname}/data/tours.json`));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello wold');
});

const getTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requests: tours.length,
    data: {
      tours,
    },
  });
};

const createTour = (req, res) => {
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
};

const getTour = (req, res) => {
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
};

const updateTour = (req, res) => {
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
};

const deleteTour = (req, res) => {
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
};

// Get tours
app.get('/api/v1/tours', getTours);

// Create tour
app.post('/api/v1/tours', createTour);

// Get tour by id
app.get('/api/v1/tours/:id', getTour);

// Update tour
app.patch('/api/v1/tours/:id', updateTour);

// Delete tour
app.delete('/api/v1/tours/:id', deleteTour);

// App running
app.listen(port, () => {
  console.log(`App listen at port ${port}`);
});
