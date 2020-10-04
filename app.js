const express = require('express');
const app = express();
const fs = require("fs");
const port = 3000;

const tours = JSON.parse(fs.readFileSync(`${__dirname}/data/tours.json`));



app.get('/', (req, res) => {
    res.send('Hello wold');
});

app.get('/api/v1/tours', (req, res) => {
    res
        .status(200)
        .json({
            status: 'success',
            requests: tours.length,
            data: {
                tours
            }
        })
})

app.listen(port, () => {
    console.log(`App listen at port ${port}`)
})

