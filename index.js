const express = require('express');
const exphbs = require('express-handlebars');
const csurf = require('csurf');
const flash = require('connect-flash');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const varMidleware = require('./middleware/variables');
const userMidleware = require('./middleware/user');
const keys = require('./keys');

const PORT = process.env.PORT || 5000;

const app = express();

const store = new MongoStore({
  collection: 'sessions',
  uri: keys.MONGODB_URI,
});

//== hbs configurations in express - start
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: require('./utils/hbs-helpers'),
});
// Register `hbs.engine` with the Express app.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');
//== hbs configurations in express - end

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
  })
);
app.use(csurf());
app.use(flash());
app.use(varMidleware);
app.use(userMidleware);

//== Routes
app.use('/', require('./routes/home'));
app.use('/courses', require('./routes/courses'));
app.use('/add', require('./routes/add'));
app.use('/card', require('./routes/card'));
app.use('/orders', require('./routes/orders'));
app.use('/auth', require('./routes/auth'));

async function start() {
  try {
    await mongoose.connect(keys.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
