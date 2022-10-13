// const mongoose = require('mongoose');
// const mongoURI = "mongodb://localhost:27017";

// const connectToMongo = () => {
//     mongoose.connect(mongoURI, { dbName: 'quizPortal' }, () => {
//         console.log("Connected To Mongo Successfully!!");
//     })
// };

// module.exports = connectToMongo;




const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const mongoURI = process.env.mongodbURI;

const connectToMongo = () => {
    mongoose.connect(mongoURI, { dbName: 'quizPortal' }, (err) => {
        console.log("Connected To Mongo Successfully!!");
        console.log(err);
    });
}

module.exports = connectToMongo;