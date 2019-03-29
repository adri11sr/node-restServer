// -----------------------
//       PUERTO
//------------------------

process.env.PORT = process.env.PORT || 3000;

// -----------------------
//       ENTORNO
//------------------------

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

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