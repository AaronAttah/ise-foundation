const { default: mongoose } = require("mongoose");

// The applicaton middleware below is to compress default mongoose error due to upcoming upgrade from mongoose
mongoose.set('strictQuery', true);

const  dbConnect = async() => {
  // try {

    // const conn = mongoose.connect(process.env.MONGODB_URL );
        // family 4 node dns first look to ipv4 first rather ipv6
        await mongoose.connect(`mongodb://localhost:27017/intanceDb`, {family: 4,  useNewUrlParser: true, useUnifiedTopology: true })
        .then(_result => {
            console.log('Connected to the db...');

        }).catch(err => {
            console.log(err);
        });
// }
};
module.exports = dbConnect;
