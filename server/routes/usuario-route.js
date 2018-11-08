const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const User = require('../models/user');

// Middleware token
const { verifyToken, verifyRole } = require('../middlewares/authenticate');

const app = express();

app.get('/usuario', verifyToken, (req, res) => {

    let ofSet = Number(req.query.ofSet) || 0,
        limit = Number(req.query.limit) || 5;

    User.find({ state: true }, 'name email role state google img')
        .skip(ofSet)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            User.count({ state: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    users,
                    total_registros: conteo
                });
            });
        });
});

app.post('/usuario', [verifyToken, verifyRole], (req, res) => {

    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: userDB
        });
    });
});

app.put('/usuario/:id', [verifyToken, verifyRole], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'state']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: userDB
        });
    });
});

app.delete('/usuario/:id', verifyToken, (req, res) => {

    let id = req.params.id,
        changeState = {
            state: false
        };
    // User.findByIdAndRemove(id, (err, userDelete) => {
    User.findByIdAndUpdate(id, changeState, { new: true }, (err, userDelete) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!userDelete) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: userDelete
        });
    });

});

module.exports = app;