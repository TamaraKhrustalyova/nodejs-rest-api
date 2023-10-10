const mongoose = require('mongoose');

const app = require('./app');

const{DB_HOST, PORT} = process.env;
console.log(DB_HOST, PORT)

mongoose.connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Database connection successful`)
    })
  })
  .catch(error => {
    console.log(error.message);
    process.exit(1);
  })

  // DB_HOST=mongodb+srv://Tamara:2t3aTJvXwi3WnHjI@cluster0.2mtshu6.mongodb.net/db-contacts?retryWrites=true&w=majority&appName=AtlasAppv
  // PORT=3000