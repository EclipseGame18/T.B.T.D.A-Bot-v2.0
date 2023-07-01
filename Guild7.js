const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const TTSQueue = mongoose.Schema({
    _id: reqString,
    string: reqString
})

module.exports = mongoose.model('TTS_queue', TTSQueue)