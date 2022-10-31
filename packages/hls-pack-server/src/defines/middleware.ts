import * as http from 'http';

export type HttpMiddleware = (request: http.IncomingMessage, response: http.ServerResponse, next: () => void) => void
