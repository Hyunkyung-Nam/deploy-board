require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DBID,
        password: process.env.DBPW,
        database: process.env.DATABASE,
        host: process.env.HOST,
        dialect: 'mysql',
        port: process.env.PORT,
    },
    test: {
        username: 'root',
        password: null,
        database: 'database_test',
        host: '127.0.0.1',
        dialect: 'mysql',
    },
    production: {
        username: process.env.PRODNAME,
        password: process.env.PRODPW,
        database: process.env.PRODDATABASE,
        host: process.env.PRODHOST,
        dialect: 'mysql',
    },
};
