const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const imagePluginToggle = mongoose.Schema({
    _id: reqString,
    toggle: reqString
})

module.exports = mongoose.model('Image-Plugin-Toggle', imagePluginToggle)