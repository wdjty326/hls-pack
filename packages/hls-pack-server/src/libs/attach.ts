import * as http from 'http';

export default function attached (
	httpServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>,
	handler: (request: http.IncomingMessage, response: http.ServerResponse, next: () => void) => void
) {
	function newListener (request: http.IncomingMessage, response: http.ServerResponse) {
		const next = originalListener ? function next () {
			originalListener(request, response);
		} : function end () {
			response.statusCode = 404;
			response.end();
		}

		handler(request, response, next);
	}

	Object.defineProperty(newListener, 'name', {
		value: (handler.name && handler.name + '_' || '') + 'attached',
	});

	const originalListener = httpServer.listeners('request')[0];
	httpServer.removeAllListeners('request');
	httpServer.addListener('request', newListener);
}
