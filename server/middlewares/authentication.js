const jwt = require('jsonwebtoken');

// -----------------------
//    Verificar Token
//------------------------

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {

            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });

        }

        req.user = decoded.user;
        next();

    });

};

// -----------------------
// Verificar Token Img
//------------------------

let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {

            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });

        }

        req.user = decoded.user;
        next();

    });

};

// -----------------------
//  Verificar ADMIN_ROLE
//------------------------

let verificaAdminRole = (req, res, next) => {

    let user = req.user;

    if (user.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'No eres administrador del sistema'
            }
        });
    }

    next();

};

module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenImg
}