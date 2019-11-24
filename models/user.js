const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = Schema({
    raza: {
        type: String,
        required: true
        
    },
    nombre:{ 
        type:String,
        required: true,
        unique: true
    },
    edad:{ 
        type:String,
        required: true
    },

    dueño: {
        type: String,
        required: true
    },
    vacunado: {
        type: String,
        required: true
    },
    enfermo: String

});

module.exports = mongoose.model("User", UserSchema);



