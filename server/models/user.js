const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

/** Validar roles */
let validateRole = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} No es un role valido'
};

// Definición de esquema
let Schema = mongoose.Schema;

// Crear esquema y propiedades
let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es requerido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validateRole
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

// Delete password temporal
userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

// Validador de email
userSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

// Exportación de modelo (esquema)
module.exports = mongoose.model('User', userSchema);