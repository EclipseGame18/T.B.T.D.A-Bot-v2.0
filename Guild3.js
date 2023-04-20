const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const guildwelcome = mongoose.Schema({
    _id: reqString,
    message: reqString
})

module.exports = mongoose.model('Guild-Welcome', guildwelcome)