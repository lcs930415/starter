const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('db connection successful');
  });

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  price: { type: Number, required: [true, 'A tour must have a price'] },
  rating: { type: Number, default: 4.5 },
});
const Tour = mongoose.Model('Tour', tourSchema);

const app = require('./app');

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app runing on port ${port}`);
});
