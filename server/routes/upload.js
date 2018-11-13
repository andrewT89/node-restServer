const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

// Import Models
const User = require('../models/user');
const Product = require('../models/product');

const fs = require('fs');
const path = require('path');

app.use(fileUpload());

app.put('/upload/:type/:id', (req, res) => {

    let type = req.params.type;
    let id = req.params.id;

    if (Object.keys(req.files).length == 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningun archivo'
                }
            });
    }

    /** Validate type */
    let typesValidate = ['products', 'users'];
    if (typesValidate.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Los tipos permitidas son: ${typesValidate.join(', ')}`
            }
        });
    }

    let archivo = req.files.archivo;
    let nameFile = archivo.name.split('.');
    let extension = nameFile[nameFile.length - 1];

    // Extensiones permitidas
    let extensionValidate = ['png', 'jpg', 'git', 'jpeg'];
    if (extensionValidate.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Las extensiones permitidas son: ${extensionValidate.join(', ')}`,
                ext: extension
            }
        });
    }

    // Change name file
    let nameFileReal = `${id}-${new Date().getMilliseconds()}.${extension}`;


    archivo.mv(`uploads/${type}/${nameFileReal}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (type === 'users') {
            imageUser(id, res, nameFileReal);
        } else {
            imageProduct(id, res, nameFileReal);
        }
    });
});

function imageProduct(id, res, nameFileReal) {
    Product.findById(id, (err, productDB) => {
        if (err) {
            deleteFile(nameFileReal, 'products');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            deleteFile(nameFileReal, 'products');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        // Validate image exist
        deleteFile(productDB.img, 'products');

        productDB.img = nameFileReal;
        productDB.save((err, prodSave) => {
            res.json({
                ok: true,
                Product: prodSave,
                img: nameFileReal
            });
        });
    });
}

function imageUser(id, res, nameFileReal) {
    User.findById(id, (err, userDB) => {
        if (err) {
            deleteFile(nameFileReal, 'users');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDB) {
            deleteFile(nameFileReal, 'users');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        // Validate image exist
        deleteFile(userDB.img, 'users');

        userDB.img = nameFileReal;
        userDB.save((err, userSave) => {
            res.json({
                ok: true,
                usuario: userSave,
                img: nameFileReal
            });
        });
    });
}

function deleteFile(nameFile, type) {
    let pathUrl = path.resolve(__dirname, `../../uploads/${type}/${nameFile}`);
    if (fs.existsSync(pathUrl)) {
        fs.unlinkSync(pathUrl);
    }
}

module.exports = app;