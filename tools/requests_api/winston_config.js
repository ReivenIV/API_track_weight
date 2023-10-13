import DailyRotateFile from "winston-daily-rotate-file";
import { logsPath } from "./constants.js";
import winston from "winston";

export async function winstonLogger() {
  const logConfiguration = {
    transports: [
      new winston.transports.Console({
        colorize: true,
      }),
    ],

    format: winston.format.combine(
      winston.format.label({
        label: "",
      }),
      winston.format.colorize({
        all: true,
      }),
      winston.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      winston.format.printf((info) => `[${[info.timestamp]}]: ${info.message}`),
    ),

    msg: "HTTP {{req.method}} {{req.url}}",
  };
  requestLogger();
  return winston.createLogger(logConfiguration);
}

async function requestLogger() {
  const requestlogConfiguration = {
    transports: [
      new DailyRotateFile({
        level: "info",
        filename: "reqinfo-%DATE%.log",
        dirname: logsPath,
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d",
      }),
    ],
    format: winston.format.combine(
      winston.format.label({
        label: "",
      }),
      winston.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      winston.format.printf((info) => `[${[info.timestamp]}]: ${info.message}`),
    ),
    msg: "HTTP {{req.method}} {{req.url}}",
  };
  winston.addColors({
    error: "red",
    warn: "yellow",
    info: "cyan",
    debug: "green",
  });

  return winston.createLogger(requestlogConfiguration);
}
