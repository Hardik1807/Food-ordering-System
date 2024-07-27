// const mongoose = require('mongoose');

// const mongoURI = 'mongodb://127.0.0.1:27017/restaurant';

// module.exports = function (callback) {
//     mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, async (err) => {
//         if (err) {
//             console.error("Error connecting to MongoDB:", err);
//             return callback(err, null, null); // Ensure callback is called with error
//         }

//         console.log("Connected to MongoDB");

//         try {
//             const foodCollection = mongoose.connection.db.collection("food_items");
//             const data = await foodCollection.find({}).toArray();

//             const categoryCollection = mongoose.connection.db.collection("Categories");
//             const Catdata = await categoryCollection.find({}).toArray();

//             // Print the data to ensure it's being fetched correctly
//             // console.log("Fetched Food Data:", data);
//             // console.log("Fetched Category Data:", Catdata);

//             callback(null, data, Catdata); // No error, pass data
//         } catch (fetchErr) {
//             console.error("Error fetching data:", fetchErr);
//             callback(fetchErr, null, null); // Handle errors in fetching data
//         }
//     });
// };


const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/restaurant', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1); // Exit the process if connection fails
  }
};

module.exports = connectDB;