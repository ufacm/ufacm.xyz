
var mongoose = require('mongoose');


var subgroupSchema = mongoose.Schema({


        name        : String,
        members: [{ type : mongoose.Schema.Types.ObjectId, ref: 'User' }]

});



// create the model for users and expose it to our app
module.exports = mongoose.model('Subgroup', subgroupSchema);
