const mongoose = require("mongoose");

// create a schema
const birdSchema = new mongoose.Schema(
    {
    _id: mongoose.Schema.Types.ObjectId,
    primary_name: {
        type: String, required: true
    },
    english_name: {
        type: String, required: true
    },
    scientific_name: {
        type: String, required: true
    },
    order: {
        type: String
    },
    family: {
        type: String, required: true
    },
    other_names: [{
        type: String
    }],
    status: {
        type: String, required: true
    },
    photo: {
        credit: { type: String, required: true },
        source: { type: String, required: true }
    },
    size: {
        length: {
            value: { type: Number, required: true },
            units: { type: String, required: true }
        },
        weight: {
            value: { type: Number, required: true },
            units: { type: String, required: true }
        }
    }

}, {collection:"profiles"});

// compile the schema into a model (named 'message')
const Birds = mongoose.model('Bird', birdSchema);

// export the model
module.exports = Birds;