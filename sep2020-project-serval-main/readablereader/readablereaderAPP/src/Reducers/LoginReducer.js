import { pinOnlyHasNumbers } from "../functions";

const initialLoginState = {
    username: "",
    pin: "",
    loading: false,
    warning: "",
    step: 1,
	googleChooseUsername: false,
    ws: false
}

const LoginReducer = ( state = initialLoginState, action ) => {
    // Note how all branches of the switch-statement always return
    // (a new version of) the state. Reducers must always return a (new) state.

    switch(action.type) {
        case "WEBSOCKET_MADE":
            return {...state, ws: true}
        case "WEBSOCKET_CLOSE":
            return {...state, ws: false}
        case "UPDATE_USERNAME":
		return { ...state, username: action.username }

		case "UPDATE_GOOGLECHOOSEUSERNAME":
		return { ...state, googleChooseUsername: action.googleChooseUsername }

        case "UPDATE_PIN":
        return pinOnlyHasNumbers(action.pin) ? { ...state, pin: action.pin } : { ...state };
        
        case "SET_WARNING":
        return { ...state, warning: action.warning }

        case "SET_LOGIN_LOADING":
        return { ...state, loading: action.loading }

        case "NEXT_LOGIN_STEP":
        return { ...state, step: state.step + 1}

        case "PREVIOUS_LOGIN_STEP":
        return { ...state, step: state.step - 1}

        case "RESET_LOGIN_PAGE":
        return { username: "", pin: "", loading: false, warning: "", step: 1 }

        default:
        return state;
    }
}

export default LoginReducer;
