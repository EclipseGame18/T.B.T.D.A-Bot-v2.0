const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const guildsware = mongoose.Schema({
    _id: reqString,
    toggle: reqString
})

module.exports = mongoose.model('Guild-Sware', guildsware)