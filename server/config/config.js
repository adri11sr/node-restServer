// -----------------------
//       PUERTO
//------------------------

process.env.PORT = process.env.PORT || 3000;

// -----------------------
//       ENTORNO
//------------------------

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// -----------------------
// Vencimiento del Token
//------------------------

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// -----------------------
//SEED de autentificacion
//------------------------

process.env.SEED = process.env.SEED || 'este-es-el-seed-secreto';

// -----------------------
//       BBDD
//------------------------

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb://cafe-user:asd123@ds119606.mlab.com:19606/cafe-udemy';
}

process.env.urlDB = urlDB;

// -----------------------
// Google client id
//------------------------

process.env.CLIENT_ID = process.env.CLIENT_ID || '973837708468-a8dca13bm67msi10dt4g18e9fqvlfe3d.apps.googleusercontent.com';