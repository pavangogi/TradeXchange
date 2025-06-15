const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const watchlistSchema = new Schema({
    userId : {type:Schema.Types.ObjectId, ref:'User', required:[true,'User id required.']},
    itemId : {type:Schema.Types.ObjectId, ref:'Trade', required:[true,'Item id is required.']}
},{timestamps : true});

module.exports = mongoose.model('Watchlist', watchlistSchema);