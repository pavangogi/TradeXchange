const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tradeSchema = new Schema({
    name : {type:String, required:[true, 'name is required']},
    productType : {type:String, required:[true, 'product type is required']},
    details : {type:String, required:[true, 'details are required'], 
                            minLength: [10 , 'the content should have atleast 10 characters.']},
    createdBy : {type:Schema.Types.ObjectId, ref:'User'},
    status : {type:String},
    category : {type:String, required:[true, 'category is required'] },
    imageURL : {type:String}
},{timestamps : true});

// collection name is trades in the DB
module.exports = mongoose.model('Trade',tradeSchema);