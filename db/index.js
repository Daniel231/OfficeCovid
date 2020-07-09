const mongoose = require("mongoose");
const util = require("util");

const config = require(`../config/config.js`).mongo;
const { warn, error, info } = require("../utils/logger");

const mongoUrl = `mongodb://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`;

const options = {
  useNewUrlParser: true,
  poolSize: config.connectionLimit,
  autoReconnect: true,
  keepAlive: true,
  connectTimeoutMS: 30000,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000
};

module.exports = async () => {
    await mongoose.connect(mongoUrl, options, (err) => {
        if (err) {
            error(util.format("Error occured on mongo database: %o", err));
        }

        info("connected successfully to mongo database.");
    });
    
    const db = mongoose.connection;
    
    db.on("connected", () => {
        info("connected successfully to mongo database.");
    });
    
    db.on("error", e => {
        error(util.format("Error occured on mongo database: %o", e));
    });
    
    db.on("disconnected", e => {
        warn(util.format("Disconnected from mongo database. %o", e));
    });
    
    db.on("reconnected", () => {
        info("Successfully reconnected to mongo database.");
    });
    
    db.on("reconnectFailed", e => {
        error(util.format("Failed to reconnect to mongo database! run out of reconnect tries. Sending a new connection request... %o", e));
    });
}