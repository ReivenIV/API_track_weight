import { winstonLogger } from "./winston_config.js";
import { getRequestDurationMs } from "./functions.js";

const logger = await winstonLogger();

export default function requestHandler(req, res, next) {
  if (!req.originalUrl.includes("/docs")) {
    const start = process.hrtime();
    let oldWrite = res.write,
      oldEnd = res.end;

    let chunks = [];

    res.write = function (chunk) {
      chunks.push(chunk);
      return oldWrite.apply(res, arguments);
    };

    res.end = async function (chunk) {
      if (chunk) {
        if (Buffer.isBuffer(chunk) || chunk instanceof Uint8Array) chunks.push(chunk);
        else chunks.push(Buffer.from(chunk));
      }

      let body = Buffer.concat(chunks).toString("utf8");
      let route = req.method + "  " + req.originalUrl;
      let user_id = req.user && req.user.userId ? req.user.userId : null;
      let request = Object.assign({}, req.body);
      if (request.raw_data) delete request.raw_data;
      if (request.timestamps) delete request.timestamps;
      request = JSON.stringify(request);
      let status;

      res.on("finish", async () => {
        const durationInMilliseconds = await getRequestDurationMs(start);
        status = this.statusCode;
        if (body.length > 200) body = body.substring(0, 200) + "...";

        switch (Math.floor(status / 100)) {
          case 5:
            logger.debug(
              `\nRoute : ${route} \nStatus :${status || 500} \n${
                user_id ? "UserId:" + user_id + " \n" : ""
              }Request:${request} \nResponse:${body} \nduration:${durationInMilliseconds.toLocaleString()} ms \n ------------------------`,
            );
            break;
          case 4:
            logger.error(
              `\nRoute : ${route} \nStatus :${status || 500} \n${
                user_id ? "UserId:" + user_id + " \n" : ""
              }Request:${request} \nResponse:${body} \nduration:${durationInMilliseconds.toLocaleString()} ms \n ------------------------`,
            );
            break;
          case 3:
            logger.warn(
              `\nRoute : ${route} \nStatus :${status || 500} \n${
                user_id ? "UserId:" + user_id + " \n" : ""
              }Request:${request} \nResponse:${body} \nduration:${durationInMilliseconds.toLocaleString()} ms \n ------------------------`,
            );
            break;
          case 2:
            logger.info(
              `\nRoute : ${route} \nStatus :${status || 500} \n${
                user_id ? "UserId:" + user_id + " \n" : ""
              }Request:${request} \nResponse:${body} \nduration:${durationInMilliseconds.toLocaleString()} ms \n ------------------------`,
            );
            break;
        }
      });

      if (res.statusCode === undefined) {
        res.statusCode = 500;
        if (res.statusMessage === undefined)
          res.statusMessage = "Errorhandler, status was undefined";
        else
          res.statusMessage += "/ Another Error from Errorhandler, status was undefined";
      }

      res.locals.responseBody = body;
      oldEnd.apply(res, arguments);
    };
  }

  next();
}
