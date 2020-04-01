const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/user');

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

app.use(async (req, res, next) => {
  try {
    const user = await User.findById('5e83639e80eaaf1a10828b14');

    req.user = user;
    next();
  } catch (e) {
    console.log(e);
  }
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

//== Routes
app.use('/', require('./routes/home'));
app.use('/courses', require('./routes/courses'));
app.use('/add', require('./routes/add'));
app.use('/card', require('./routes/card'));
app.use('/orders', require('./routes/orders'));

async function start() {
  try {
    const url =
      'mongodb+srv://admin:W1QgPUzjRoJVAWbv@cluster0-arlmn.azure.mongodb.net/app';
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });

    const condidate = await User.findOne();
    if (!condidate) {
      const user = new User({
        email: 'admin@admin.com',
        name: 'Admin',
        cart: { items: [] }
      });
      await user.save();
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
