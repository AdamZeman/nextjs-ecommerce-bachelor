const { createServer } = require('http');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { parse } = require('url');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const next = require('next');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const WebSocket = require('ws');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const nextServer = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    });

    nextServer.listen(3000, (err) => {
        if (err) throw err;
        console.log('> Next.js ready on http://localhost:3000');
    });

    const wsServer = new WebSocket.Server({ port: 3001 });
    console.log('> WebSocket server ready on ws://localhost:3001');

    const clients = new Set();

    wsServer.on('connection', (ws) => {
        console.log('New client connected');
        clients.add(ws);

        ws.on('message', (messageData) => {
            const receivedData = JSON.parse(messageData);
            console.log('Received:', receivedData);

            clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        email: receivedData.email,
                        input: receivedData.input
                    }));
                }
            });
        });

        ws.on('close', () => {
            console.log('Client disconnected');
            clients.delete(ws);
        });
    });
});