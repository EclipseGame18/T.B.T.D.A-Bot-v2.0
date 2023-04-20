const mongoose = require('mongoose')
const mongoPath = process.env.MONGO_PATH

module.exports = async () => {
    await mongoose.connect(mongoPath, {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(()=>{
        console.log('Connected to MongoDB!')
    }).catch((err) =>{
        console.log('There was an error connecting to Mongodb:' + err)
    })
    return mongoose
}