const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const MessageLogging = mongoose.Schema({
    _id: reqString,
    toggle: reqString
})

module.exports = mongoose.model('Message-Logging', MessageLogging)