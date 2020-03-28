const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

const PORT = process.env.PORT || 5000;

const app = express();

//== hbs configurations in express - start
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
});
// Register `hbs.engine` with the Express app.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');
//== hbs configurations in express - end

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

//== Routes
app.use('/', require('./routes/home'));
app.use('/courses', require('./routes/courses'));
app.use('/add', require('./routes/add'));
app.use('/card', require('./routes/card'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
