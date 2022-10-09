const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const QuizSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    start: {
        type: Date,
        requried: true
    },
    end: {
        type: Date,
        required: true
    },
    ownerName: {
        type: String,
        required: true
    },
    ownerId: {
        type: String,
        required: true
    },
    totalMarks: {
        type: Number,
        required: true
    },
    easyQuestions: {
        type: Array,
        required: true
    },
    mediumQuestions: {
        type: Array,
        required: true
    },
    hardQuestions: {
        type: Array,
        required: true
    },
    isApproved: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

module.exports = mongoose.model('quiz', QuizSchema);