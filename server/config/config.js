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
process.env.CADUCIDAD_TOKE = '48h';

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

/**
 * Google client ID
 */

process.env.CLIENT_ID = process.env.CLIENT_ID || '981765371185-bs4uia7iqev89kki0iiq3rnil5djspgb.apps.googleusercontent.com';