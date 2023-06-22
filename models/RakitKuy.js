const mongoose = require('mongoose')

const rakitkuySchema = mongoose.Schema({
    content: {
        type: String,
        require: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    modified_date: {
        type: Date,
        default: null
    }
},({
    versionKey: false
}))

module.exports = mongoose.model('RakitKuy', rakitkuySchema, 'rakitkuy')