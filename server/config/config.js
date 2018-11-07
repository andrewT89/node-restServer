/**  
 * Puerto
 */
process.env.PORT = process.env.PORT || 3000;

/**
 * Enviroments
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**
 * DB MONGO
 */
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = `mongodb://localhost:27017/cafe`;
} else {
    urlDB = `mongodb://andrew-user:aft081889@ds153593.mlab.com:53593/dbcafe`;
}

// Strings conexion
process.env.URLDB = urlDB;