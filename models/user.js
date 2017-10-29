var mongoose = require('mongoose');
require('mongoose-type-email');

const userSchema = mongoose.Schema({
	name:{
		type: String,
		maxlength: 30,
		required: true
	},
	age:{
		type: Number,
		min: 0,
		max: 200,
		required: true
	},
	email:{
		type: mongoose.SchemaTypes.Email
	},
		phone: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /\d{3}[\-]\d{3}[\-]\d{3}/.test(v);
            },
            message: '{VALUE} is not a valid phone number!'
        }
    }
});

const User = module.exports = mongoose.model('persons', userSchema);


module.exports.getPersons = (callback) => {
	User.find(callback);
}

module.exports.addUser = (user, callback) => {
	User.create(user, callback);
}

