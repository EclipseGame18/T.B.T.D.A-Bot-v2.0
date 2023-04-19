const mongoose = require('mongoose')
const mongoPath = "mongodb+srv://Bot_Agent:Minecraft18@bot-settings.miusd.mongodb.net/Bot-Settings?retryWrites=true&w=majority"

module.exports = async () => {
    await mongoose.connect(mongoPath, {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(()=>{
        console.log('Connected to MongoDB!')
    }).catch((err) =>{
        console.log(err)
    })
    return mongoose
}