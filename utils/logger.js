const { createLogger, format, transports } = require("winston");
const events = require("events");
const eventEmitter = new events.EventEmitter();

let logger = null;

const logLevels = {
  debug: "debug",
  info: "info",
  warn: "warn",
  error: "error",
  critical: "crit"
};

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

const getConsoleLoggerOptions = config => {
  return {
    level: config.level,
    handleExceptions: true,
    json: false,
    colorize: true
  };
};

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
