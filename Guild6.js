const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const toggleEco = mongoose.Schema({
    _id: reqString,
    toggle: reqString
})

module.exports = mongoose.model('Toggle_eco', toggleEco)