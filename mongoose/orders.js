let mongoose = require('mongoose')
const moment = require('moment');

// connects to mongo db
// mongoose.connect('mongodb://localhost/chat');

let OrderSchema = new mongoose.Schema({
    client: {
        type: {
            first_name: {type: String},
            last_name: {type: String},
            email: {type: String},
            phone: {type: String}
        },
        required: true
    },
    startPoint: {
        type: {
            name: {type: String},
            coordinate: {type: {latitude: {type: Number}, longitude: {type: Number}}},
        }
    },
    endPoint: {
        type: {
            name: {type: String},
            coordinate: {type: {latitude: {type: Number}, longitude: {type: Number}}},
        }
    },
    wayType: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    more: {
        type: Object,
        default: false
    },
    payment: {
        type: String,
        default: false
    },
    status: {
        type: String,
        default: false
    },
    created: {
        type: Date,
        default: moment().format()
    }

});

module.exports = mongoose.model('Orders', OrderSchema);
