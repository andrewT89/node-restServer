/**  
 * Puerto
 */
process.env.PORT = process.env.PORT || 3000;

/**
 * Enviroments
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**
 * VENCIMIENTO TOKEN
 */
process.env.CADUCIDAD_TOKE = 60 * 60 * 24 * 30;

/**
 * SEED
 */

process.env.SEED = process.env.SEED || 'this-id-the-seed-dev'


/**
 * DB MONGO
 */
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = `mongodb://localhost:27017/cafe`;
} else {
    urlDB = process.env.MONGO_URI;
}

// Strings conexion
process.env.URLDB = urlDB;