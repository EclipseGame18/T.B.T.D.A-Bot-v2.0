const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const guildLogchannel = mongoose.Schema({
    _id: reqString,
    channel: reqString
})

module.exports = mongoose.model('Guild-Log-Channel', guildLogchannel)