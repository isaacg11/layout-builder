const mongoose = require('mongoose');

const LayoutSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    rectangles: {
        type: Array, 
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    dt_created: {
        type: Date,
        required: true,
        default: new Date()
    },
    dt_deleted: {
        type: Date,
        default: null
    }
})

const Layout = mongoose.model('Layout', LayoutSchema);
module.exports = Layout;