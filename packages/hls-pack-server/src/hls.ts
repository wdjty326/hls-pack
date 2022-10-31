import * as http from "http";
import * as fs from "fs";
import * as url from "url";
import * as path from "path";

import * as provider from "./libs/provider";
import attached from "./libs/attach";
import { HttpMiddleware } from "./defines/middleware";
import { options } from "./defines/options";

const middleware: HttpMiddleware = (request, response, next) => {
  const uri = url.parse(request.url).pathname;
  const relativePath = path.relative(options.path, uri);
  const filePath = path.join(options.dir, relativePath);
  const extension = path.extname(filePath);

  provider
    .exists(filePath)
    .then((exists) => {
      if (!exists) {
        response.statusCode = 404;
        response.end();
      } else {
        switch (extension) {
          case ".m3n8":
            return ["manifest", provider.getStream(filePath)];
          case ".ts":
            return ["segment", provider.getStream(filePath)];
          default:
            next();
            break;
        }
      }
    })
    .then((value) => {
      if (Array.isArray(value)) {
        const type = value[0];
        switch (type) {
          case "manifest":
            response.setHeader("Content-Type", "application/vnd.apple.mpegurl");
            response.statusCode = 200;
            break;
          case "segment":
            response.setHeader("Content-Type", "video/MP2T");
            response.statusCode = 200;
            break;
        }
      }
    });
};

const httpServer = http.createServer();
attached(httpServer, middleware);
