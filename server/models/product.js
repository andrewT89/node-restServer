var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
    nameProd: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    priceUni: {
        type: Number,
        required: [true, 'El precio únitario es necesario']
    },
    descProd: {
        type: String,
        required: false
    },
    enable: {
        type: Boolean,
        required: true,
        default: true
    },
    Category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    User: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Product', productSchema);