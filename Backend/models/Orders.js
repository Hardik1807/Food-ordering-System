const mongoose = require('mongoose')

const { Schema } = mongoose;

const OrderSchema = new Schema({
    Table: {
        type: Number,
        required: true,
    },
    order_data: {
        type: Array,
        required: true,
    },
    Total :{
        type:Number
    }

});

module.exports = mongoose.model('order', OrderSchema)