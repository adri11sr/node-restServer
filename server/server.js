const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('./config/config');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/user'));

mongoose.connect(process.env.urlDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {

    if (err) throw err

    console.log('Data Base ONLINE');

});

app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto: ', process.env.PORT);
});