/**
 * The module is responsible for all the winston logger configuration.
 * 
 * @author Daniel231
 */

const { createLogger, format, transports } = require("winston");
const events = require("events");
const eventEmitter = new events.EventEmitter();

let logger = null;

// Setting the options for the logs levels
const logLevels = {
  debug: "debug",
  info: "info",
  warn: "warn",
  error: "error",
  critical: "crit"
};

/**
 * 
 * 
 * @param {json} config = 
 */
const getFileLoggerOptions = config => {
  return {
    level: config.level,
    filename: config.logPath,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, 
    maxFiles: 5,
    colorize: false
  };
};

/**
 * 
 * @param {*} config 
 */
const getConsoleLoggerOptions = config => {
  return {
    level: config.level,
    handleExceptions: true,
    json: false,
    colorize: true
  };
};

/**
 * 
 * @param {*} logger 
 */
const registerToLogEvents = logger => {
  eventEmitter.on(logLevels.debug, data => {
    logger.debug(data);
  });

  eventEmitter.on(logLevels.info, data => {
    logger.info(data);
  });

  eventEmitter.on(logLevels.warn, data => {
    logger.warn(data);
  });

  eventEmitter.on(logLevels.error, data => {
    logger.error(data);
  });

  eventEmitter.on(logLevels.critical, data => {
    logger.crit(data);
  });
};

module.exports.debug = data => {
  eventEmitter.emit(logLevels.debug, data);
};

module.exports.info = data => {
  eventEmitter.emit(logLevels.info, data);
};

module.exports.warn = data => {
  eventEmitter.emit(logLevels.warn, data);
};

module.exports.error = data => {
  eventEmitter.emit(logLevels.error, data);
};

module.exports.critical = data => {
  eventEmitter.emit(logLevels.critical, data);
};

module.exports.getLogger = config => {
  if (!logger) {
    logger = createLogger({
      transports: [
        new transports.File(getFileLoggerOptions(config)),
        new transports.Console(getConsoleLoggerOptions(config))
      ],
      exitOnError: false
    });

    logger.stream = {
      write: (message, encoding) => {
        logger.log(config.incomingRequestsLogLevel, message);
      }
    };

    registerToLogEvents(logger);
  }

  return logger;
};
