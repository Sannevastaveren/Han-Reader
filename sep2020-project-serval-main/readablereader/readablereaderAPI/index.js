const express = require('express');
const http = require('http');
const bodyParser = require('body-parser')
const route_rest = require('./routes/rest');
const cors = require('cors')
const WebSocket = require('ws')
const session = require('express-session')

const expressApp = express();
const httpServer = http.createServer();

expressApp.use(cors({ origin: true, credentials: true }))
expressApp.options('*', cors({ origin: true, credentials: true }))

expressApp.use(bodyParser.json())

// intialize session parser
const sessionParser = session({
	saveUninitialized: false,
	secret: 'mg$L?78fw:W#3=k',
	resave: false,
})

expressApp.use(sessionParser)

expressApp.use("/api/v1/", (req, res, next) => {
	res.setHeader('Access-Control-Allow-Headers', '*');
	res.setHeader('Access-Control-ALlow-methods', '*');
	if (req.method === "OPTIONS") {
		return res.status(200).end();
	}
	next();
})

// put websocket server in req so we can access it in a message function
expressApp.use('/', async function(req, res, next) {
	req.webSocketServer = webSocketServer
	next()
})

expressApp.use("/api/v1/", route_rest);

httpServer.on('request', expressApp);

if (require.main === module) {
	httpServer.listen(3001, () => {
		console.log("ReadableReader_server is now running!");
	})
}

// make websocket server
const webSocketServer = new WebSocket.Server({noServer: true})

// upgrade handler sends message back to the user with the websocket
httpServer.on('upgrade', (req, networkSocket, head) => {
	sessionParser(req, {}, () => {
		webSocketServer.handleUpgrade(req, networkSocket, head, newWebSocket => {
			if(req.session.username !== undefined){
				console.log('making connection', req.session.username)
				webSocketServer.emit('connection', newWebSocket, req)
			}
		})
	})
})

// connection handler puts the session info into the socket session so that username is saved in the socket
webSocketServer.on('connection', (socket, req) => {
	socket.session = req.session
	// message handler
	socket.on('message', (message) => {
		// for if its needed :)
	})

	// close handler
	socket.on('close', (message) => {
		// for if we wanna do something when socket closes
	})

})

module.exports = httpServer