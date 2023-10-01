const mongoose = require('mongoose')
const mongoURI = "mongodb://127.0.0.1:27017/iNotebook?directConnection=true&tls=false&readPreference=primary"
mongoose.set('strictQuery', false);

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Mongodb connected");
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = connectToMongo;