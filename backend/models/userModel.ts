const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },  
    email: {
        type: String,
        required: true,
        unique : true
    },
    password : {
        type : String,
        required : true,
    }
})

userSchema.plugin(uniqueValidator,{message : 'This email has already been registered'});

module.exports = mongoose.model('User',userSchema);
