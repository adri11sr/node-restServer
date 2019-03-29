const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const app = express();

app.get('/user', function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    User.find({ estado: true }, 'nombre email role estado google id')
        .skip(desde)
        .limit(limite)
        .exec((err, users) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            User.count({ estado: true }, (err, totalReg) => {

                res.json({
                    ok: true,
                    TotalUsers: totalReg,
                    users
                });

            });

        });

});

app.post('/user', function(req, res) {

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

        //userDB.password = ':)';

        res.json({
            ok: true,
            user: userDB
        });

    });

});

app.put('/user/:id', function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'img', 'role', 'estado']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });

    });

});

app.put('/user/delete/:id', function(req, res) {

    let id = req.params.id;

    let cambioEstado = {
        estado: false
    }

    User.findByIdAndUpdate(id, cambioEstado, { new: true }, (err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });

    });

});

app.delete('/user/:id', function(req, res) {

    let id = req.params.id;

    User.findByIdAndRemove(id, (err, UserRemove) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!UserRemove) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            user: UserRemove
        });

    });

});

module.exports = app;