const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const guildwelcomechannel = mongoose.Schema({
    _id: reqString,
    channel: reqString
})

module.exports = mongoose.model('Guild-Welcome-Channel', guildwelcomechannel)