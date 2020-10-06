const app = require('./app')

const port = 3000;

// App running
app.listen(port, () => {
    console.log(`App listen at port ${port}`);
});