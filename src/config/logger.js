// const winston = require("winston");
const { createLogger, format, transports  } = require("winston");
const { combine, timestamp, label, printf ,colorize} = format;


const CATEGORY = "FOOD-VILLA APPLICATION";

//     error: 0,
//     warn: 1,
//     info: 2,
//     http: 3,
//     verbose: 4,
//     debug: 5,
//     silly: 6
//   };

const loggingFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
   
  format: combine(colorize({ all: true }),label({ label: CATEGORY}), timestamp(), loggingFormat),
  transports: [new transports.Console()],
});

module.exports = logger;
