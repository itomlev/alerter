const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: false}));

const indexRouter = require('./routes/index');
app.use('/', indexRouter);

app.listen(port, () => console.log(`App listening at port ${port}`));

module.exports = app;
