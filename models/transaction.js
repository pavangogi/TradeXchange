const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    giverId : {type:Schema.Types.ObjectId, ref:'User', required:[true,'Giver is required.']},
    takerId : {type:Schema.Types.ObjectId, ref:'User', required:[true,'Taker is required.']},
    giveItem : {type:Schema.Types.ObjectId, ref:'Trade', required:[true,'Give Item is required.']},
    takeItem : {type:Schema.Types.ObjectId, ref:'Trade', required:[true,'Take Item is required.']},
    status: {type:String}
},{timestamps : true});

module.exports = mongoose.model('Transaction',transactionSchema);