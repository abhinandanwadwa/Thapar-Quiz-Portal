const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const QuestionSchema = new Schema({
    statement: {
        type: String,
        required: true
    },
    options: {
        type: Array,
        required: true
    },
    correctAns: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true
    },
    marks: {
        type: Number,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('question', QuestionSchema);