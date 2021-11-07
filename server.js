
const express = require('express');
const path = require('path');
const app = express();
const indexRouter = require('./routes/index.routes');



app.use(express.static(path.join(__dirname)));

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));


app.use('/', indexRouter);


app.listen(3000);