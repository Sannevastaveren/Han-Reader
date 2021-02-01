// port of the server
const port = 3001

// url of the server
const server = `ws://${window.location.hostname}:${port}`

// the websocket connection of the user
let wsConnection

// in case you wanna send a message to the server from the client
export function sendMessage(message) {
    return (dispatch) => {
        wsConnection.send(JSON.stringify(message))
        dispatch(message)
    }
}

export function websocket() {

    return (dispatch) => {
        // if there is no websocket yet make a websocket
        if(wsConnection === undefined) {
            wsConnection = new WebSocket(server)
            dispatch({type: 'WEBSOCKET_MADE'})
        }
        // receive messages here
        wsConnection.onmessage = (e) => {
            // send to the reducers what got send in the message
            dispatch(JSON.parse(e.data))
        }

        wsConnection.onopen = (e) => {
            console.log('WEBSOCKET OPEN: ', e)
        }

        wsConnection.onclose = (e) => {
            wsConnection = undefined
            dispatch({type: 'WEBSOCKET_CLOSE'})
            console.log('WEBSOCKET CLOSED: ', e)
        }

        wsConnection.onerror = (e) => {
            console.log('WEBSOCKET ERROR: ', e)
        }
    }
}
