const express = require('express');
const fs = require('fs');
const path = require('path');
const fileUpload = require('express-fileupload');
const app = express();

const User = require('../models/user');
const Producto = require('../models/producto');

app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    // Validar tipo
    let tipoValido = ['productos', 'users'];

    if (tipoValido.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las tipos permitidas son ' + tipoValido.join(', ')
            },
            tipo
        });
    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[1];

    // Extensiones permitidas
    let extValidad = ['png', 'jpg', 'gif', 'jpeg'];

    if (extValidad.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extValidad.join(', ')
            },
            ext: extension
        });
    }

    // Cambiar Nombre archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        // Imagen cargada
        if (tipo === 'users') {
            imagenUser(id, res, nombreArchivo);
        } else if (tipo === 'productos') {
            imagenProducto(id, res, nombreArchivo);
        }

    });

});

function imagenUser(id, res, nombreArchivo) {

    User.findById(id, (err, userDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'users');
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!userDB) {
            borraArchivo(nombreArchivo, 'users');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        borraArchivo(userDB.img, 'users');

        userDB.img = nombreArchivo;

        userDB.save((err, userGuardado) => {
            res.json({
                ok: true,
                user: userGuardado,
                img: nombreArchivo
            });
        })

    });

}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        })

    });

}

function borraArchivo(nombreImg, tipo) {

    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImg}`);

    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }

}

module.exports = app;