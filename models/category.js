const mongoose = require("mongoose");



function autoPopulateSubs(next) {
    this.populate('items');
    next();
}

const categorySchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ['item', 'subcategory'],
        required: true
    },
    items: {
        type: [
            mongoose.Types.ObjectId
        ],
        ref: 'category'
    }
}, {
    collection: 'category'
});

categorySchema
    // to populate top level items we are using findone 
    .pre('findOne', autoPopulateSubs)
    // to populate rest of nested items one by one we are using find
    .pre('find', autoPopulateSubs);


module.exports = mongoose.model('category', categorySchema);