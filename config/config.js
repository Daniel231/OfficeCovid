require('dotenv').config()

module.exports = {
    "mongo": {
        "connectionLimit": process.env.MONGO_CONNECTION_LIMIT,
        "port" : process.env.MONGO_PORT,
        "host": process.env.MONGO_HOSTNAME,
        "user": process.env.MONGO_USERNAME,
        "password": process.env.MONGO_PASSWORD,
        "database": process.env.MONGO_DATABASE,
    },
    "mail": {
        "host": process.env.MAIL_HOST,
        "user": process.env.MAIL_USERNAME,
        "password": process.env.MAIL_PASSWORD
    },
}