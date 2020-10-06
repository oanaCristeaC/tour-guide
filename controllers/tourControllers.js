const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../data/tours.json`));

// Tours logic
exports.getTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        requests: tours.length,
        data: {
            tours,
        },
    });
};

exports.createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({
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

exports.getTour = (req, res) => {
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

exports.updateTour = (req, res) => {
    //console.log('params', req.params);

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

exports.deleteTour = (req, res) => {
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