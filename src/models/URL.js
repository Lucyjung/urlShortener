const mongoose = require('mongoose');
const shortId = require('short-mongo-id') ;
const Schema =  mongoose.Schema;


const URLSchema = new Schema({
    url: String,        // Input URL
    shorten: String     // Shorten URL
},{
    timestamps: true,   // Timestamp for debug
    versionKey: false,  // no version needed
    strict: true
});
URLSchema.pre('save', function(next) {
    // If shorten URL has been provided, no need to regenerate
    if (!this.shorten){
        this._id = mongoose.Types.ObjectId();     
        this.shorten = shortId(this._id.toString());
    }
    next();

});

const URL = mongoose.model('URL', URLSchema, 'url');


module.exports = URL;
