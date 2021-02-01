/**
 * Finds the websocket of the user by username in the session, then sends the message and payload to the clients
 * that are logged in with the same username, if DELETE is given as payload the websockets will be closed
 * @param clients: Array , with all open websockets
 * @param socket: Object ,current websocket
 * @param message: String ,  message to send to clients for instance something that can be caught in the reducers
 * @param payload: String , status or extra data to be sent with the message
 */
userMessage = function (clients,socket, message, payload) {
    // go over all open websockets and find the right users to match the session
    clients.forEach((client) => {
        if (
            // check if its the user of the session
            socket.session.username === client.session.username
        ) {
            // send a message to the main user
            client.send(
                JSON.stringify({
                    type: message,
                    status: payload
                })
            )
            // if the payload is DELETE then close the websocket (not implemented)
            if(payload === 'DELETE'){
                client.close()
            }
        }
    })
}

module.exports = {
    userMessage,
}
